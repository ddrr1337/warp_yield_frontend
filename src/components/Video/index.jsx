import SectionTitle from "../Common/SectionTitle";

const Video = () => {
  return (
    <section
      id="team"
      className="overflow-hidden bg-gray-1 pb-12 pt-20 dark:bg-dark-2 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container">
        <div className=" aspect-video ">
          <iframe
            className=" h-full w-full rounded-lg"
            src="https://www.youtube.com/embed/j7J9Vb9Nw2E"
            width="100%"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Video;
