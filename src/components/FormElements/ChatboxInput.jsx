const ChatboxInput = ({ foo, setFoo }) => {
  return (
    <>
      <input
        id="text-message"
        value={foo}
        type="text"
        onChange={(e) => {
          setFoo(e.target.value);
        }}
      ></input>
    </>
  );
};

export default ChatboxInput;
