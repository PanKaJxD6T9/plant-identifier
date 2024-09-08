interface PlantInfoProps {
  plantData: {
    rawResponse: string;
  };
}

// Helper function to remove asterisks and trim whitespace
const cleanText = (text: string) => {
  return text.replace(/\*/g, '').trim();
};

export function PlantInfo({ plantData }: PlantInfoProps) {
  console.log("Raw plant data:", plantData); // Debug log

  if (!plantData.rawResponse || plantData.rawResponse.trim() === "Here is the information about the plant in the image:") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold mb-4 text-yellow-600">Plant Information Unavailable</h2>
        <p className="text-gray-700">
          We're sorry, but detailed information about this plant is not currently available.
        </p>
      </div>
    );
  }

  // Clean the raw response
  const cleanedResponse = cleanText(plantData.rawResponse);
  console.log("Cleaned response:", cleanedResponse); // Debug log

  // Parse the cleaned response
  const lines = cleanedResponse.split('\n').map(line => line.trim()).filter(line => line);
  console.log("Parsed lines:", lines); // Debug log

  const title = lines[0].replace('##', '').trim();
  const sections: Record<string, string> = {};
  let notableFeatures = '';

  for (let i = 1; i < lines.length; i++) {
    const match = lines[i].match(/^(\d+)\.\s(.+?):\s(.+)$/);
    if (match) {
      const [, , key, value] = match;
      if (key === "Notable features or interesting facts") {
        notableFeatures = value;
        // Collect additional lines for notable features
        while (i + 1 < lines.length && !lines[i + 1].match(/^\d+\./)) {
          notableFeatures += ' ' + lines[i + 1];
          i++;
        }
      } else {
        sections[key] = value;
      }
    }
  }

  console.log("Parsed sections:", sections); // Debug log
  console.log("Notable features:", notableFeatures); // Debug log

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-green-800">{title}</h2>
      {sections['Scientific name'] && (
        <p className="text-gray-600 italic mb-4">{sections['Scientific name']}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(sections).map(([key, value]) => (
          key !== 'Scientific name' && <InfoSection key={key} title={key} content={value} />
        ))}
      </div>
      {notableFeatures && (
        <div className="mt-4">
          <h3 className="font-semibold text-green-700 mb-1">Notable Features or Interesting Facts</h3>
          <p className="text-gray-700">{notableFeatures}</p>
        </div>
      )}
    </div>
  );
}

function InfoSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="font-semibold text-green-700 mb-1">{title}</h3>
      <p className="text-gray-700">{content}</p>
    </div>
  );
}