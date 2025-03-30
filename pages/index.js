import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Mbogiwood Productions</title>
        <meta name="description" content="Bringing Stories to Life" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-900 text-white">
        <section className="hero-section flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/hero-bg.jpg)' }}>
          <div className="text-center">
            <h1 className="text-5xl font-bold">Bringing Stories to Life</h1>
            <div className="mt-5">
              <button className="bg-green-500 py-2 px-4 rounded">Explore Projects</button>
              <button className="bg-yellow-500 py-2 px-4 rounded ml-4">Join Our Team</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
