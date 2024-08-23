function MyButton()
{
  return (
    <button>
      I'm a button
    </button>
  );
}

function MyApp()
{
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyText />
      <MyButton />
    </div>
  );
}

function MyText()
{
  return <h4>Hello World</h4>

}
