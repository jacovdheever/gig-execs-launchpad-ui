
export default async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://gigexecs.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { filePath, expiresIn = 3600 } = JSON.parse(req.body);
    
    if (!filePath) {
      return res.status(400).json({ error: 'filePath is required' });
    }
    
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    let bucketName, fileName;
    
    if (filePath.includes('/') && !filePath.includes(' ')) {
      // New format: bucket-name/user-id/filename
      const [bucket, ...pathParts] = filePath.split('/');
      bucketName = bucket;
      fileName = pathParts.join('/');
    } else {
      // Legacy format: just filename (assume id-documents bucket)
      bucketName = 'id-documents';
      fileName = filePath;
    }
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, expiresIn);
    
    if (error) {
      console.error('Signed URL generation error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.status(200).json({ signedUrl: data.signedUrl });
    
  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({ error: error.message });
  }
};
