<script>
    import { fade, fly } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
  
    // Define the two sentences
    const sentences = [
      "HCH Business Online - Merry Christmas",
      "Happy Festive Season"
    ];
  
    let currentIndex = 0; // To track the current sentence
    let words = sentences[currentIndex].split(' '); // Split the current sentence into words
    let timer;
  
    // Function to toggle the sentence
    function toggleSentence() {
      currentIndex = (currentIndex + 1) % sentences.length;
      words = sentences[currentIndex].split(' ');
    }
  
    // Set up the interval on component mount
    onMount(() => {
      timer = setInterval(toggleSentence, 9000); // 6000ms = 6 seconds
    });
  
    // Clean up the interval on component destroy
    onDestroy(() => {
      clearInterval(timer);
    });
  </script>
  
  <style>
    .word {
      display: inline-block;
      margin-right: 0.25rem; /* Space between words */
    }
  </style>
  
  <div class="text-[25px] mt-5 text-white font-bold w-full flex items-center justify-center">
    {#each words as word, index (word + index)}
      <span
        class="word"
        in:fade={{  duration: 500, delay: 500 }}
        out:fade={{ duration: 0 }}
      >
        {word}
      </span>
    {/each}
  </div>
  