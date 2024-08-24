import Image from "next/image";
import ImageRecognition from "../src/components/ImageRecognition"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ImageRecognition></ImageRecognition>
    </main>
  );
}
