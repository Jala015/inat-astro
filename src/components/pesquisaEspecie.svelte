<script lang="ts">
  import { speciesData } from "@scripts/store.ts";
  import Loading from "@components/loading.svelte";

  let value = "";
  let buscando = false;
  let buscou = false;

  async function buscaEspecie() {
    buscando = true;
    console.log("iniciando busca...");
    const resposta = await fetch(
      encodeURI(`https://api.gbif.org/v1/species/match?name=${value.trim()}`)
    ).catch((error) => {
      alert(error);
      console.error(error);
      buscando = false;
    });
    buscando = false;
    if (resposta) {
      speciesData.set(await resposta.json());
      buscou = true;
      console.log(await buscaDados("1,2", `${$speciesData.speciesKey}`)); //todo salvar só os dados importantes em respectivos stores e realizar próximas consultas
    }
  }

  //   todo mapa com turfJS?

  async function buscaDados(meses: String, speciesKey: string) {
    const consulta = `https://api.gbif.org/v1/occurrence/search?taxonKey=${speciesKey}&datasetKey=50c9509d-22c7-4a22-a47d-8c48425ef4a7&fromDate=2015-01&toDate=2022-12&limit=50&month=${meses}&offset=0&occurrenceStatus=PRESENT`;
    const resposta = await fetch(consulta);
    return await resposta.json();
  }
</script>

{#if !buscou}
  <div class="flex-grow flex flex-wrap gap-2 items-end">
    <label class="flex-grow">
      <span class="text-slate-600 block">Nome científico</span>
      <input
        name="nome cientifico"
        class="p-2 w-full block shadow-sm nome-cientifico rounded-md italic"
        type="text"
        bind:value
      />
    </label>

    <button
      on:click={() => buscaEspecie()}
      class="bg-lime-600 block p-2 rounded-lg shadow-sm hover:shadow-md  hover:bg-lime-500 text-white font-bold flex-grow"
      >Buscar espécie</button
    >
  </div>
{/if}
{#if buscou || buscando}
  {#if buscando}
    <div role="status">
      <Loading />
      <span class="sr-only">Loading...</span>
    </div>
  {:else if $speciesData.species}
    <pre
      class="block leading-loose overflow-x-scroll bg-slate-500 shadow-inner rounded-lg max-w-max text-white p-4 mt-10">
Reino:    {$speciesData.kingdom}
Filo:     {$speciesData.phylum}
Classe:   {$speciesData.class}
Ordem:    {$speciesData.order}
Família:  {$speciesData.family}
Espécie:  <i class="font-bold">{$speciesData.species}</i>
</pre>
  {:else}
    <pre
      class="block bg-slate-500 shadow-inner rounded-lg max-w-max text-white p-4 mt-10">
Nenhum dado
</pre>
  {/if}
{/if}

<style>
  .nome-cientifico::first-letter{
    text-transform: uppercase;
  }
</style>