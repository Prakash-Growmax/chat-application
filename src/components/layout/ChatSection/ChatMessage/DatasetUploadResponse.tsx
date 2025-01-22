import Typewriter from "typewriter-effect";
const DatasetUploadResponse = ({ message }) => {
  return (
    <div className="flex flex-col m-auto text-base py-2">
      <Typewriter
        options={{
          strings: [String(message)],
          autoStart: true,
          delay: 30,
          cursor: "",
          deleteSpeed: 9999999,
        }}
      />
    </div>
  );
};
export default DatasetUploadResponse;
