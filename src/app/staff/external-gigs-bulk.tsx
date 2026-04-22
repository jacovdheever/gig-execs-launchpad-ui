import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { StaffRoute } from '@/components/staff/StaffRoute';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  MAX_BULK_ROWS,
  PROJECT_STATUSES,
  TIMELINE_OPTIONS,
  formatIdList,
  parseBulkFile,
  parseIdList,
  rowToApiPayload,
  validateBulkRow,
  type BulkGigRow
} from '@/lib/externalGigBulk';

const ROLE_TYPES = [
  { value: '__none__', label: '—' },
  { value: 'in_person', label: 'In-person' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' }
];

export default function StaffExternalGigsBulkPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [skills, setSkills] = useState<{ id: number; name: string }[]>([]);
  const [industries, setIndustries] = useState<{ id: number; name: string }[]>([]);
  const [refLoading, setRefLoading] = useState(true);

  const [rows, setRows] = useState<BulkGigRow[]>([]);
  const [parsing, setParsing] = useState(false);
  const [committing, setCommitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setRefLoading(true);
      try {
        const [sk, ind] = await Promise.all([
          supabase.from('skills').select('id, name').order('name'),
          supabase.from('industries').select('id, name').order('name')
        ]);
        if (cancelled) return;
        if (sk.error) throw sk.error;
        if (ind.error) throw ind.error;
        setSkills((sk.data || []) as { id: number; name: string }[]);
        setIndustries((ind.data || []) as { id: number; name: string }[]);
      } catch (e) {
        console.error(e);
        toast({
          title: 'Failed to load reference data',
          description: 'Skills and industries are required to validate uploads.',
          variant: 'destructive'
        });
      } finally {
        if (!cancelled) setRefLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const validSkillIds = useMemo(() => new Set(skills.map((s) => s.id)), [skills]);
  const validIndustryIds = useMemo(() => new Set(industries.map((i) => i.id)), [industries]);

  const rowErrors = useMemo(() => {
    if (refLoading) return rows.map(() => ['Loading reference data…']);
    const opts = { validSkillIds, validIndustryIds };
    return rows.map((r) => validateBulkRow(r, opts));
  }, [rows, refLoading, validSkillIds, validIndustryIds]);

  const hasErrors = rowErrors.some((e) => e.length > 0);
  const canCommit =
    rows.length > 0 &&
    rows.length <= MAX_BULK_ROWS &&
    !hasErrors &&
    !refLoading &&
    !committing;

  const patchRow = useCallback((index: number, patch: Partial<BulkGigRow>) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r))
    );
  }, []);

  const onFileSelected = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    const name = file.name.toLowerCase();
    if (!name.endsWith('.xlsx') && !name.endsWith('.xls') && !name.endsWith('.csv')) {
      toast({
        title: 'Unsupported file',
        description: 'Please upload an .xlsx, .xls, or .csv file.',
        variant: 'destructive'
      });
      return;
    }

    setParsing(true);
    try {
      const buffer = await file.arrayBuffer();
      const parsed = parseBulkFile(buffer, file.name);
      if (parsed.length === 0) {
        toast({
          title: 'No data rows',
          description: 'The file had no non-empty rows (title/description/URL).',
          variant: 'destructive'
        });
        setRows([]);
        return;
      }
      if (parsed.length > MAX_BULK_ROWS) {
        toast({
          title: 'Too many rows',
          description: `This file has ${parsed.length} data rows. Maximum is ${MAX_BULK_ROWS}. Split into multiple files.`,
          variant: 'destructive'
        });
        setRows([]);
        return;
      }
      setRows(parsed);
      toast({
        title: 'File loaded',
        description: `${parsed.length} row(s) ready for review.`
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Failed to read file',
        description: 'Could not parse this spreadsheet. Check the template format.',
        variant: 'destructive'
      });
      setRows([]);
    } finally {
      setParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCommit = async () => {
    if (!canCommit) return;
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in as staff.',
        variant: 'destructive'
      });
      return;
    }

    const gigs = rows.map((r) => {
      const p = rowToApiPayload(r);
      return {
        title: p.title,
        description: p.description,
        status: p.status,
        external_url: p.external_url,
        expires_at: p.expires_at,
        source_name: p.source_name,
        currency: 'USD',
        budget_min: p.budget_min,
        budget_max: p.budget_max,
        delivery_time_min: p.delivery_time_min,
        delivery_time_max: p.delivery_time_max,
        skills_required: p.skills_required,
        industries: p.industries,
        role_type: p.role_type,
        gig_location: p.gig_location
      };
    });

    setCommitting(true);
    try {
      const response = await fetch('/.netlify/functions/staff-external-gigs-bulk-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ gigs })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const details = result.details as { index?: number; messages?: string[] }[] | undefined;
        if (Array.isArray(details) && details.length > 0) {
          const first = details[0];
          toast({
            title: 'Server validation failed',
            description: `Row ${(first.index ?? 0) + 1}: ${(first.messages || []).join('; ')}`,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Commit failed',
            description: result.error || 'Unexpected error.',
            variant: 'destructive'
          });
        }
        return;
      }

      toast({
        title: 'External gigs created',
        description: `Successfully created ${result.created ?? gigs.length} opportunity(ies).`
      });
      setRows([]);
      navigate('/staff/external-gigs');
    } catch (e) {
      console.error(e);
      toast({
        title: 'Commit failed',
        description: 'Network or unexpected error.',
        variant: 'destructive'
      });
    } finally {
      setCommitting(false);
    }
  };

  return (
    <StaffRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/staff/external-gigs')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to External Gigs
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Bulk Gig Creation</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload the template, fix any validation issues in the table, then commit (max{' '}
                    {MAX_BULK_ROWS} rows, all-or-nothing).
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="/downloads/external-gigs-bulk-import-template.xlsx" download>
                    Download template
                  </a>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => onFileSelected(e.target.files)}
                />
                <Button
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={parsing || refLoading}
                >
                  {parsing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload file
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!canCommit}
                  onClick={handleCommit}
                >
                  {committing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Commit {rows.length > 0 ? `(${rows.length})` : ''}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>
                Use the <strong>gigs</strong> sheet from the template (or the first sheet in CSV exports).
                Required columns: title, description, status, external_url. In the spreadsheet, skill and
                industry columns use comma-separated numeric IDs (see the skills and industries sheets).
                After upload, you can edit skills and industries by name in the table. Delivery timing uses
                the timeline field only (same as manual external gig create). Errors appear in the second
                column.
              </CardDescription>
            </CardHeader>
          </Card>

          {rows.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {refLoading ? 'Loading skills and industries…' : 'Upload a filled template to begin.'}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Review ({rows.length} rows)</CardTitle>
                <CardDescription>
                  {hasErrors
                    ? 'Fix highlighted issues before committing.'
                    : 'All rows pass validation. You can still edit, then commit.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto max-h-[70vh] overflow-y-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 sticky top-0 z-20">
                        <TableHead className="sticky left-0 z-30 bg-slate-50 min-w-[3rem]">#</TableHead>
                        <TableHead className="sticky left-12 z-30 bg-slate-50 min-w-[200px] max-w-[260px]">
                          Errors
                        </TableHead>
                        <TableHead className="min-w-[160px]">Title</TableHead>
                        <TableHead className="min-w-[240px]">Description</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[200px]">External URL</TableHead>
                        <TableHead className="min-w-[160px]">Expires</TableHead>
                        <TableHead className="min-w-[140px]">External Client Name</TableHead>
                        <TableHead className="min-w-[100px]">Budget TBC</TableHead>
                        <TableHead className="min-w-[100px]">Budget USD</TableHead>
                        <TableHead className="min-w-[120px]">Timeline</TableHead>
                        <TableHead className="min-w-[220px]">Skills</TableHead>
                        <TableHead className="min-w-[220px]">Industries</TableHead>
                        <TableHead className="min-w-[100px]">Role type</TableHead>
                        <TableHead className="min-w-[140px]">Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row, i) => (
                        <TableRow key={i} className={rowErrors[i].length ? 'bg-red-50/50' : ''}>
                          <TableCell className="sticky left-0 z-10 bg-white align-top text-muted-foreground text-sm">
                            {i + 1}
                          </TableCell>
                          <TableCell className="sticky left-12 z-10 bg-white align-top text-xs text-red-700 max-w-[260px]">
                            {rowErrors[i].length ? (
                              <ul className="list-disc pl-4 space-y-0.5">
                                {rowErrors[i].map((msg, j) => (
                                  <li key={j}>{msg}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-emerald-700">OK</span>
                            )}
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              value={row.title}
                              onChange={(e) => patchRow(i, { title: e.target.value })}
                              className="min-w-[140px] text-xs h-8"
                            />
                          </TableCell>
                          <TableCell className="align-top">
                            <Textarea
                              value={row.description}
                              onChange={(e) => patchRow(i, { description: e.target.value })}
                              className="min-w-[220px] min-h-[64px] text-xs"
                              rows={3}
                            />
                          </TableCell>
                          <TableCell className="align-top">
                            <Select
                              value={row.status}
                              onValueChange={(v) => patchRow(i, { status: v })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {PROJECT_STATUSES.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              value={row.external_url}
                              onChange={(e) => patchRow(i, { external_url: e.target.value })}
                              className="min-w-[180px] text-xs h-8"
                            />
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              type="datetime-local"
                              value={isoToLocalInput(row.expires_at)}
                              onChange={(e) =>
                                patchRow(i, {
                                  expires_at: localInputToIso(e.target.value)
                                })
                              }
                              className="min-w-[160px] text-xs h-8"
                            />
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              value={row.source_name}
                              onChange={(e) => patchRow(i, { source_name: e.target.value })}
                              className="text-xs h-8"
                            />
                          </TableCell>
                          <TableCell className="align-top">
                            <div className="flex items-center justify-center pt-1">
                              <Checkbox
                                checked={isTruthyString(row.budget_to_be_confirmed)}
                                onCheckedChange={(c) => {
                                  const on = c === true;
                                  patchRow(i, {
                                    budget_to_be_confirmed: on ? 'true' : 'false',
                                    budget_amount: on ? '' : row.budget_amount
                                  });
                                }}
                                aria-label="Budget to be confirmed"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              type="number"
                              min={0}
                              step={100}
                              disabled={isTruthyString(row.budget_to_be_confirmed)}
                              value={
                                isTruthyString(row.budget_to_be_confirmed) ? '' : row.budget_amount
                              }
                              onChange={(e) => patchRow(i, { budget_amount: e.target.value })}
                              className="text-xs h-8"
                            />
                          </TableCell>
                          <TableCell className="align-top">
                            <Select
                              value={row.timeline || '__none__'}
                              onValueChange={(v) =>
                                patchRow(i, { timeline: v === '__none__' ? '' : v })
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="—" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">—</SelectItem>
                                {TIMELINE_OPTIONS.map((o) => (
                                  <SelectItem key={o.value} value={o.value}>
                                    {o.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="align-top">
                            <IdMultiSelectCell
                              value={row.skills_required}
                              onChange={(next) => patchRow(i, { skills_required: next })}
                              options={skills}
                              maxItems={15}
                              placeholder="Search skills…"
                            />
                          </TableCell>
                          <TableCell className="align-top">
                            <IdMultiSelectCell
                              value={row.industries}
                              onChange={(next) => patchRow(i, { industries: next })}
                              options={industries}
                              maxItems={10}
                              placeholder="Search industries…"
                            />
                          </TableCell>
                          <TableCell className="align-top">
                            <Select
                              value={row.role_type ? row.role_type : '__none__'}
                              onValueChange={(v) =>
                                patchRow(i, { role_type: v === '__none__' ? '' : v })
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLE_TYPES.map((r) => (
                                  <SelectItem key={r.value} value={r.value}>
                                    {r.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              value={row.gig_location}
                              onChange={(e) => patchRow(i, { gig_location: e.target.value })}
                              className="text-xs h-8 min-w-[120px]"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </StaffRoute>
  );
}

function IdMultiSelectCell({
  value,
  onChange,
  options,
  maxItems,
  placeholder
}: {
  value: string;
  onChange: (next: string) => void;
  options: { id: number; name: string }[];
  maxItems: number;
  placeholder: string;
}) {
  const selectedIds = useMemo(() => parseIdList(value), [value]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const nameById = useMemo(
    () => new Map(options.map((o) => [o.id, o.name])),
    [options]
  );

  const addId = (id: number) => {
    if (selectedIds.includes(id) || selectedIds.length >= maxItems) return;
    onChange(formatIdList([...selectedIds, id]));
    setQuery('');
    setOpen(false);
  };

  const removeId = (id: number) => {
    onChange(formatIdList(selectedIds.filter((x) => x !== id)));
  };

  const filtered = useMemo(() => {
    const pool = options.filter((o) => !selectedIds.includes(o.id));
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return pool.filter((o) => o.name.toLowerCase().includes(q)).slice(0, 50);
  }, [options, selectedIds, query]);

  const atCap = selectedIds.length >= maxItems;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={containerRef} className="relative min-w-[180px] max-w-[280px] py-1">
      <div className="flex flex-wrap gap-1 mb-1.5">
        {selectedIds.map((id) => (
          <Badge
            key={id}
            variant="secondary"
            className="text-xs font-normal gap-0.5 pr-0.5 max-w-full"
          >
            <span className="truncate" title={nameById.get(id) ?? `ID ${id}`}>
              {nameById.get(id) ?? `ID ${id}`}
            </span>
            <button
              type="button"
              className="rounded-sm p-0.5 hover:bg-muted shrink-0"
              onClick={() => removeId(id)}
              aria-label={`Remove ${nameById.get(id) ?? id}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={atCap ? 'Maximum selected' : placeholder}
        disabled={atCap}
        className="h-8 text-xs"
        autoComplete="off"
      />
      {open && !atCap && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          {!query.trim() ? (
            <div className="px-2 py-2 text-xs text-muted-foreground">Type to search and add</div>
          ) : filtered.length === 0 ? (
            <div className="px-2 py-2 text-xs text-muted-foreground">No matches</div>
          ) : (
            filtered.map((o) => (
              <button
                key={o.id}
                type="button"
                className="w-full px-2 py-1.5 text-left text-xs hover:bg-accent hover:text-accent-foreground"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addId(o.id)}
              >
                {o.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function isoToLocalInput(iso: string): string {
  if (!iso.trim()) return '';
  const d = new Date(iso.trim());
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => `${n}`.padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputToIso(local: string): string {
  if (!local) return '';
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString();
}

function isTruthyString(raw: string): boolean {
  const t = raw.trim().toLowerCase();
  return t === 'true' || t === '1' || t === 'yes';
}
