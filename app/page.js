export default function Home() {
  return (
    <div>
      <h2>Hello</h2>
      <Button>Hello Ji</Button>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/dashboard', // Specify the path to your dashboard page
      permanent: false, // This redirection is not permanent
    },
  };
}