// Test script for the generate-wish function
const testFunction = async () => {
  const functionUrl = 'https://erdkwgoslgdmgxchsqtv.supabase.co/functions/v1/generate-wish';
  
  const testData = {
    name: 'John',
    photoUrl: null
  };

  try {
    console.log('🧪 Testing Edge Function...');
    console.log('URL:', functionUrl);
    console.log('Data:', testData);

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success!');
      console.log('Result:', JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
    }
  } catch (error) {
    console.log('💥 Network Error:', error.message);
  }
};

// Run the test
testFunction();