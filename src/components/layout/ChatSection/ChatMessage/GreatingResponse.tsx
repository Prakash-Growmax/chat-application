import Typewriter from "typewriter-effect";
const GreetingResponse = ({message}) =>{
 return(
    <Typewriter
    options={{
      strings: [String(message)],
      autoStart: true,
      delay: 30,
      cursor: "",
      deleteSpeed: 9999999,
    }}
  />
 )
}
export default GreetingResponse;