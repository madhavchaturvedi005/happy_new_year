// Test script to verify OpenAI is working
const testOpenAI = async () => {
  const functionUrl = 'https://erdkwgoslgdmgxchsqtv.supabase.co/functions/v1/generate-wish';
  
  const testData = {
    name: 'Alexander', // A name with clear meaning
    photoUrl: null
  };

  try {
    console.log('🧪 Testing OpenAI integration...');
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
      
      // Check if it's using OpenAI (look for specific indicators)
      const isOpenAI = (
        result.name_meaning.includes('origin') || 
        result.name_meaning.includes('meaning') ||
        result.name_meaning.includes('Greek') ||
        result.name_meaning.includes('Latin') ||
        result.personalized_wish.includes(result.name) ||
        result.personalized_wish.length > 200
      );
      
      if (isOpenAI) {
        console.log('🤖 OpenAI is working! Generating personalized responses.');
      } else {
        console.log('⚠️ Seems to be using fallback');
      }
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
    }
  } catch (error) {
    console.log('💥 Network Error:', error.message);
  }
};

// Run the test
testOpenAI();