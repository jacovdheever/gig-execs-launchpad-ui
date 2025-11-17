-- Add message, proposal, and screening_answers columns to bids table
-- This allows storing the full bid proposal text and screening question answers

-- Add message column (the proposal text)
alter table bids
  add column if not exists message text;

-- Add proposal column (alternative name for message, for compatibility)
alter table bids
  add column if not exists proposal text;

-- Add screening_answers column (JSON string to store answers to screening questions)
alter table bids
  add column if not exists screening_answers text;

-- Add updated_at column if it doesn't exist
alter table bids
  add column if not exists updated_at timestamp with time zone default now();

-- Add comments for the new columns
comment on column bids.message is 'The proposal/message text submitted with the bid';
comment on column bids.proposal is 'Alternative field for proposal text (for compatibility)';
comment on column bids.screening_answers is 'JSON string containing answers to project screening questions';
comment on column bids.updated_at is 'Timestamp when the bid was last updated';

-- Create trigger to automatically update updated_at timestamp
create or replace function update_bids_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_bids_updated_at_trigger on bids;
create trigger update_bids_updated_at_trigger
  before update on bids
  for each row
  execute function update_bids_updated_at();

