import { getProviders, signIn } from "next-auth/react";

const login = ({ providers }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-black min-h-screen w-full">
      <img
        className="w-52 mb-5"
        src="https://links.papareact.com/9xl"
        alt="spotify logo"
      />
      {Object.values(providers).map((provider) => (
        <button
          key={provider.id}
          className="bg-black hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => signIn(provider.id, { callbackUrl: "/" })}
        >
          Login with {provider.name}
        </button>
      ))}
    </div>
  );
};

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}
