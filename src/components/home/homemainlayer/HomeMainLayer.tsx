import Image from "next/image";
import pencil from "@/app/public/images/main-image.jpg";
import golden_frame from "@/app/public/images/golden-frame.jpg";

export default function HomeMainLayer() {
  return (
    <div className="w-full flex justify-center lg:w-auto">
      <section
        id="image-place"
        className="relative rounded-lg max-w-[320px] max-h-[280px] lg:min-w-[600px] lg:min-h-[450px] lg:max-w-[600px] lg:max-h-[450px] w-full h-auto"
      >
        <Image
          src={golden_frame}
          alt="golden-frame"
          className="w-full h-full rounded-lg"
        />
        <Image
          src={pencil}
          alt="this is the main image"
          className="absolute inset-0 m-auto w-[90%] h-[90%] object-cover rounded-lg"
        />
      </section>
    </div>
  );
}
