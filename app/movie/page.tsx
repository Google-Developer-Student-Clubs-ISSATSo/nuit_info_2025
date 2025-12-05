import Image from 'next/image'

export default function FemmesInformatiquePage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-2 min-h-[calc(100vh-4rem)]">
      <h1 className="mb-12 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-center text-4xl font-bold text-transparent">
        Femmes & Informatique
      </h1>

      <div className="space-y-12">
        {/* Description Section */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Description du Projet</h2>
          <div className="prose prose-lg max-w-none">
            <p className="mb-4">
              Notre projet "Femmes & Informatique" met en lumière la
              contribution essentielle des femmes dans l'histoire du numérique
              et souligne l'importance de la mixité dans les métiers
              technologiques. À travers un flyer visuel et une vidéo de trois
              minutes, nous avons choisi de valoriser les pionnières qui ont
              posé les fondations de l'informatique — telles qu'Ada Lovelace,
              Grace Hopper ou Margaret Hamilton — ainsi que les innovatrices
              contemporaines comme Fei-Fei Li ou Radia Perlman.
            </p>
            <p className="mb-4">
              Notre démarche vise à rappeler que l'informatique n'a jamais été
              réservée à un genre et que les progrès technologiques actuels sont
              le fruit de talents divers. Malgré cela, les femmes restent encore
              sous-représentées dans les formations et dans les carrières
              numériques.
            </p>
            <p className="mb-4">
              Le projet propose un message inspirant et accessible, encourageant
              les jeunes femmes à s'engager dans les domaines technologiques et
              appelant à construire un environnement plus inclusif. Nous avons
              voulu créer un support visuellement attractif, pédagogique et
              motivant, capable de sensibiliser aussi bien les étudiants que le
              grand public.
            </p>
            <p>
              À travers cette initiative, nous souhaitons contribuer à rendre
              visible ce qui devrait être évident : l'informatique se construit
              avec toutes et tous.
            </p>
          </div>
        </section>
        <div className="flex flex-col-reverse gap-8">
          {/* Flyer Section */}
          <section className="text-center">
            <h2 className="mb-6 text-2xl font-semibold">Flyer</h2>
            <div className="flex justify-center">
              <Image
                src="/flyer_nuit_dinfo-01.png"
                alt="Flyer Femmes & Informatique"
                width={600}
                height={800}
                className="rounded-lg"
              />
            </div>
          </section>

          {/* Video Section */}
          <section className="text-center">
            <h2 className="mb-6 text-2xl font-semibold">Vidéo</h2>
            <div className="aspect-video">
              <iframe
                src="https://drive.google.com/file/d/1DjRyJSM6keWSaVA8DPRunXdBQjSM_XaQ/preview"
                width="100%"
                height="100%"
                className="rounded-lg"
                allow="autoplay"
              ></iframe>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
