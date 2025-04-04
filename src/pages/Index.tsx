
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
// import WorkflowVisual from "@/components/home/WorkflowVisual";
import CallToAction from "@/components/home/CallToAction";
import Layout from "@/components/layout/Layout";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <HowItWorks />
      {/* <WorkflowVisual /> */}
      <CallToAction />
    </Layout>
  );
};

export default Index;
