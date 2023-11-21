<script lang="ts">
  import { speciesData } from "@scripts/store.ts";
  import Loading from "@components/loading.svelte";
  import L from "leaflet";
  import { onMount } from "svelte";

  let value = "";
  let buscando = false;
  let buscou = false;
  let map = null;

  onMount(() => {
    map = L.map("map").setView([-30.04493904, 55.0444], 2);
    L.tileLayer(
      "  https://tile.gbif.org/4326/omt/{z}/{x}/{y}@1x.png?style=gbif-dark",
      {
        maxZoom: 19,
        noWrap: true,
      }
    ).addTo(map);
  
  });



  function getMonthName(month) {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    return months[month - 1];
  }

  async function adicionarMapa(taxonKey: number) {
    const camadas = {};

    for (let month = 1; month <= 12; month++) {
      const layer = L.tileLayer(
        `https://api.gbif.org/v2/map/occurrence/adhoc/{z}/{x}/{y}@1x.png?style=purpleYellow-noborder.poly&taxonKey=${taxonKey}&month=${month}&src=EPSG:3426&bin=hex&hexPerTile=30`,
        {
          maxZoom: 19,
          noWrap: true,
          attribution: "&copy; GBIF",
        }
      );

      const monthName = getMonthName(month);
      camadas[monthName] = layer;
    }

    const verao = L.tileLayer(
        `https://api.gbif.org/v2/map/occurrence/adhoc/{z}/{x}/{y}@1x.png?style=orange.marker&taxonKey=${taxonKey}&month=1,3&src=EPSG:3426&bin=hex&hexPerTile=30`,
        {
          maxZoom: 19,
          noWrap: true,
          attribution: "&copy; GBIF",
        }
      );

      const inverno = L.tileLayer(
        `https://api.gbif.org/v2/map/occurrence/adhoc/{z}/{x}/{y}@1x.png?style=blue.marker&taxonKey=${taxonKey}&month=7,9&src=EPSG:3426&bin=hex&hexPerTile=30`,
        {
          maxZoom: 19,
          noWrap: true,
          attribution: "&copy; GBIF",
        }
      );

     camadas['<span class="text-red-500">Verão austral<span>'] = verao;

     camadas['<span class="text-blue-500">Inverno austral<span>'] = inverno;


    L.control.layers(camadas, null,{collapsed: false}).addTo(map);
  }

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
      adicionarMapa($speciesData.speciesKey);
      // const dados1 = await buscaDados("1", `${$speciesData.speciesKey}`);
      // console.log(dados1); //todo salvar só os dados importantes em respectivos stores e realizar próximas consultas
    }
  }

  //   todo mapa com turfJS?

  async function buscaDados(meses: String, speciesKey: string, offset = 0) {
    const consulta = `https://api.gbif.org/v1/occurrence/search?taxonKey=${speciesKey}&datasetKey=50c9509d-22c7-4a22-a47d-8c48425ef4a7&fromDate=2015-01&toDate=2022-12&limit=50&month=${meses}&offset=${offset}&occurrenceStatus=PRESENT`;
    const resposta = await fetch(consulta);
    return await resposta.json();
  }
</script>
<div class="flex flex-wrap items-center justify-center gap-5">

  {#if !buscou}
    <div class="flex-grow flex flex-wrap gap-2 items-end w-[80vw]">
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
      class="bg-lime-600 block p-2 rounded-lg shadow-sm hover:shadow-md hover:bg-lime-500 text-white font-bold flex-grow"
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
    <div>

      <pre
      class="block leading-loose overflow-x-scroll bg-slate-500 shadow-inner rounded-lg max-w-max text-white p-4 mt-10">
Reino:    {$speciesData.kingdom}
Filo:     {$speciesData.phylum}
Classe:   {$speciesData.class}
Ordem:    {$speciesData.order}
Família:  {$speciesData.family}
Espécie:  <i class="font-bold">{$speciesData.species}</i>
</pre>
<button class="bg-lime-600 hover:bg-lime-500 p-2 rounded-md w-full my-5 text-slate-100" on:click={()=>{location.reload()}}>Reiniciar</button>
</div>
{:else}
<div>

  <pre
  class="block bg-slate-500 shadow-inner rounded-lg max-w-max text-white p-4 mt-10">
  Nenhum dado
</pre>
<button class="bg-lime-600 hover:bg-lime-500 p-2 rounded-md w-full my-5 text-slate-100" on:click={()=>{location.reload()}}>Reiniciar</button>
</div>
{/if}
{/if}

<div class="h-96 bg-slate-300 w-full sm:w-2/3 my-5" id="map" />

</div>