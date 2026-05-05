import Benefits from "./Benefits";
import FeatureBlocks from "./FeatureBlocks";
import Hero from "./Hero";

const Index = () => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <Hero />
      <FeatureBlocks />
      <Benefits />
      
    </main>
  );
};

export default Index;