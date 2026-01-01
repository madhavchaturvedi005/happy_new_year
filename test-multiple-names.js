// Test multiple names to show OpenAI variety
const testMultipleNames = async () => {
  const names = ['Abhilasha', 'Sarah', 'David', 'Priya', 'Michael'];
  const functionUrl = 'https://erdkwgoslgdmgxchsqtv.supabase.co/functions/v1/generate-wish';

  for (const name of names) {
    try {
      console.log(`\n🧪 Testing name: ${name}`);
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, photoUrl: null })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ ${name}:`);
        console.log(`📖 Meaning: ${result.name_meaning}`);
        console.log(`🎊 Wish: ${result.personalized_wish.substring(0, 100)}...`);
      } else {
        console.log(`❌ Error for ${name}`);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`💥 Error testing ${name}:`, error.message);
    }
  }
};

testMultipleNames();