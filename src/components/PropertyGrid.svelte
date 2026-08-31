<script lang="ts">
  import RangeSlider from "svelte-range-slider-pips";
  export let properties: any = [];

  // --- Normalization ---
  function normalize(item: any) {
    const data = item?.data ?? item ?? {};
    const slug = data.slug ?? item?.slug ?? item?.id;
    return {
      raw: data,
      title:
        `${data["Street Number"] ?? ""} ${data["Street Name"] ?? ""}, ${data.City ?? ""}`.trim() ||
        "Untitled",
      slug,
      coverSrc:
        data.coverSrc ??
        (data.cover && slug
          ? `./assets/properties/${slug}/images/${data.cover}`
          : undefined),
      price:
        typeof data["List Price"] === "number" ? data["List Price"] : undefined,
      bedrooms:
        typeof data["Bedrooms Total"] === "number"
          ? data["Bedrooms Total"]
          : undefined,
      type: data["Card Format"],
      city: data.City,
    };
  }

  // Normalize incoming properties
  $: normalizedProps = Array.isArray(properties)
    ? properties.map(normalize)
    : properties && typeof properties === "object"
      ? [normalize(properties)]
      : [];

  // Extract unique filter values
  $: uniqueCities = Array.from(
    new Set(normalizedProps.map((p) => p.city).filter(Boolean)),
  ).sort();
  $: uniqueTypes = Array.from(
    new Set(normalizedProps.map((p) => p.type).filter(Boolean)),
  ).sort();

  // Price bounds
  $: prices = normalizedProps
    .map((p) => p.price)
    .filter((p) => typeof p === "number");
  $: minPrice = prices.length ? Math.min(...prices) : 0;
  $: maxPrice = prices.length ? Math.max(...prices) : 0;
  // RangeSlider needs a non-zero range, even when there is only one property.
  $: sliderMax = maxPrice > minPrice ? maxPrice : minPrice + 1;

  let priceRange: number[] = [minPrice, sliderMax];
  // Initialize full price range on page load
  $: if (normalizedProps.length && prices.length) {
    priceRange = [minPrice, sliderMax];
  }

  // Other filters
  let selectedCity = "";
  let selectedType = "";
  let minBedrooms = 0;
  let sortAscending = true; // true = ascending price

  // Filtering logic
  $: filtered = normalizedProps
    .filter((p) => {
      if (selectedType && p.type !== selectedType) return false;
      if (selectedCity && p.city !== selectedCity) return false;
      if (
        minBedrooms > 0 &&
        (typeof p.bedrooms !== "number" || p.bedrooms < minBedrooms)
      )
        return false;
      if (typeof p.price === "number") {
        if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      }
      return true;
    })
    .sort((a, b) =>
      sortAscending
        ? (a.price ?? 0) - (b.price ?? 0)
        : (b.price ?? 0) - (a.price ?? 0),
    );
</script>

<!-- ======================= -->
<!--      FILTER PANEL       -->
<!-- ======================= -->
<div class="filter-box">
  <div class="filter-grid">
    <!-- Row 1 -->
    <div class="filter-block price-block">
      <label for="price-range">Price</label>
      <RangeSlider
        bind:values={priceRange}
        min={minPrice}
        max={sliderMax}
        id="price-range"
        range
        rangeFloat
        rangeFormatter={(v1, v2) =>
          `$${v1.toLocaleString()} — $${v2.toLocaleString()}`}
        formatter={(v) => `$${v.toLocaleString()}`}
      />
    </div>

    <div class="filter-block">
      <label for="city-select">City</label>
      <select bind:value={selectedCity}>
        <option value="">Any</option>
        {#each uniqueCities as city}
          <option value={city}>{city}</option>
        {/each}
      </select>
    </div>

    <div class="filter-block bedroom-block">
      <label for="bedroom-select">Bedrooms</label>
      <div class="bedroom-buttons" id="bedroom-select">
        {#each [0, 1, 2, 3, 4, 5, 6] as num}
          <button
            type="button"
            class:active={minBedrooms === num}
            on:click={() => (minBedrooms = num)}
          >
            {num === 0 ? "Any" : `${num}+`}
          </button>
        {/each}
      </div>
    </div>

    <!-- Row 2 -->
    <div class="filter-block empty-block"></div>
    <div class="filter-block">
      <label for="type-select">Property Type</label>
      <select bind:value={selectedType}>
        <option value="">Any</option>
        {#each uniqueTypes as type}
          <option value={type}>{type}</option>
        {/each}
      </select>
    </div>

    <div class="filter-block sort-block">
      <button type="button" on:click={() => (sortAscending = !sortAscending)}>
        {sortAscending ? "Price ↑" : "Price ↓"}
      </button>
    </div>
  </div>
</div>

<!-- ======================= -->
<!--       PROPERTY GRID     -->
<!-- ======================= -->
<div class="grid">
  {#each filtered as prop (prop.slug ?? prop.title)}
    <a class="card" href={prop.slug ? `/properties/${prop.slug}` : "#"}>
      {#if prop.coverSrc}
        <img src={prop.coverSrc} alt={prop.title} loading="lazy" />
      {:else}
        <div class="no-image">No image</div>
      {/if}
      <div class="info">
        <h3>{prop.title}</h3>
        {#if prop.price !== undefined}
          <p class="price">${prop.price.toLocaleString()}</p>
        {/if}
        <p class="details">
          {#if prop.bedrooms !== undefined}{prop.bedrooms} bd{/if}
          {#if prop.type}
            {prop.type}{/if}
        </p>
      </div>
    </a>
  {/each}
</div>

<style>
  .filter-box {
    background: var(--foreground-body);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    box-shadow: 0 4px 12px var(--text-main);
    margin-bottom: 2rem;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 0.5rem;
  }

  .filter-block label {
    font-weight: 600;
    display: block;
    margin-bottom: 0.25rem;
  }

  select {
    width: 100%;
    padding: 0.35rem 0.5rem;
    border: 1px solid var(--text-main);
    background: #fff;
    border-radius: 6px;
  }

  .bedroom-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .bedroom-buttons button {
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--text-main);
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .bedroom-buttons button.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }

  .sort-block {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end; /* aligns to bottom */
  }

  .sort-block button {
    align-items: flex-end; /* aligns to bottom */
    padding: 0.4rem 0.75rem;
    border: 1px solid var(--text-main);
    border-radius: 6px;
    background: white;
    cursor: pointer;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0;
  }

  .card {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background: var(--foreground-body);
    text-decoration: none;
    color: var(--text-secondary);
    text-align: center;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    max-width: 320px;
    margin: 0 auto;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  .no-image {
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    color: #9ca3af;
  }

  .info {
    padding: 1rem;
  }

  .info h3,
  .price,
  .details {
    margin: 0;
  }

  .info h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.35rem;
  }

  .price {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.25rem;
  }

  .details {
    font-size: 0.85rem;
    color: var(--primary-color);
  }
</style>
