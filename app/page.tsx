import Header from "@/src/components/Header";
import ImageRecognition from "../src/components/ImageRecognition"

export default function Home() {
  return (
    <main className="flex flex-col h-full">
      <Header/>
      <ImageRecognition/>
    </main>
  );
}
