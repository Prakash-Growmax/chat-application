export const AppShell = ({ dom }: { dom: boolean }) => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fff",
        zIndex: 1000,
        position: "fixed",
      }}
    >
      <h1>App Shell of the application....</h1>
      {dom && <h2>Dom Element</h2>}
    </div>
  );
};
