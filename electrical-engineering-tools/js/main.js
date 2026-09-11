document.addEventListener("DOMContentLoaded", function () {

    /*
        GET PAGE ELEMENTS
    */

    const searchInput =
        document.getElementById(
            "calculatorSearch"
        );


    const calculatorCards =
        Array.from(
            document.querySelectorAll(
                ".calculator-card"
            )
        );


    const categoryCards =
        Array.from(
            document.querySelectorAll(
                ".category-card"
            )
        );


    const noResults =
        document.getElementById(
            "noResults"
        );


    const calculatorSection =
        document.getElementById(
            "calculators"
        );


    /*
        Stop safely if this script is ever
        loaded on a page without the homepage
        calculator search.
    */

    if (
        !searchInput ||
        calculatorCards.length === 0 ||
        !noResults
    ) {

        return;

    }


    let activeCategory =
        "all";


    /*
        NORMALIZE TEXT

        Makes searching easier by:

        - converting text to lowercase
        - replacing special dash characters
        - removing extra spaces
    */

    function normalizeText(text) {

        return String(text)
            .toLowerCase()
            .replace(/[–—]/g, "-")
            .replace(/\s+/g, " ")
            .trim();

    }


    /*
        CHECK SEARCH MATCH

        Each word entered by the user must
        appear somewhere in the calculator's
        searchable content.

        Example:

        "motor current"

        can match a card even if those words
        are not directly beside each other.
    */

    function matchesSearchTerms(
        searchableText,
        searchTerm
    ) {

        if (searchTerm === "") {
            return true;
        }


        const searchWords =
            searchTerm
                .split(" ")
                .filter(Boolean);


        return searchWords.every(
            function (word) {

                return searchableText.includes(
                    word
                );

            }
        );

    }


    /*
        REMOVE CATEGORY HIGHLIGHT
    */

    function removeActiveCategory() {

        categoryCards.forEach(
            function (card) {

                card.classList.remove(
                    "active-category"
                );


                card.removeAttribute(
                    "aria-current"
                );

            }
        );

    }


    /*
        FILTER CALCULATORS
    */

    function filterCalculators() {

        const searchTerm =
            normalizeText(
                searchInput.value
            );


        let visibleCount =
            0;


        calculatorCards.forEach(
            function (card) {


                const dataName =
                    card.dataset.name || "";


                const dataCategory =
                    card.dataset.category || "";


                const heading =
                    card.querySelector("h3")
                        ?.textContent || "";


                const description =
                    card.querySelector("p")
                        ?.textContent || "";


                const searchableText =
                    normalizeText(
                        dataName +
                        " " +
                        dataCategory +
                        " " +
                        heading +
                        " " +
                        description
                    );


                /*
                    SEARCH MATCH
                */

                const matchesSearch =
                    matchesSearchTerms(
                        searchableText,
                        searchTerm
                    );


                /*
                    CATEGORY MATCH
                */

                const matchesCategory =
                    activeCategory === "all" ||
                    normalizeText(
                        dataCategory
                    ) ===
                    normalizeText(
                        activeCategory
                    );


                /*
                    SHOW OR HIDE CARD
                */

                if (
                    matchesSearch &&
                    matchesCategory
                ) {

                    card.style.display =
                        "";

                    visibleCount++;

                } else {

                    card.style.display =
                        "none";

                }

            }
        );


        /*
            SHOW / HIDE
            NO RESULTS MESSAGE
        */

        if (
            visibleCount === 0
        ) {

            noResults.style.display =
                "block";

        } else {

            noResults.style.display =
                "none";

        }

    }


    /*
        SEARCH INPUT
    */

    searchInput.addEventListener(
        "input",
        function () {


            /*
                Typing in search returns
                the user to all categories.
            */

            activeCategory =
                "all";


            removeActiveCategory();


            filterCalculators();

        }
    );


    /*
        CATEGORY FILTERING
    */

    categoryCards.forEach(
        function (categoryCard) {


            categoryCard.addEventListener(
                "click",
                function (event) {


                    event.preventDefault();


                    const categoryHeading =
                        categoryCard.querySelector(
                            "h3"
                        );


                    if (!categoryHeading) {
                        return;
                    }


                    const selectedCategory =
                        categoryHeading
                            .textContent
                            .trim();


                    activeCategory =
                        selectedCategory;


                    /*
                        Clear search when
                        selecting a category.
                    */

                    searchInput.value =
                        "";


                    /*
                        Remove previous
                        active state.
                    */

                    removeActiveCategory();


                    /*
                        Highlight selected
                        category.
                    */

                    categoryCard.classList.add(
                        "active-category"
                    );


                    categoryCard.setAttribute(
                        "aria-current",
                        "true"
                    );


                    /*
                        Filter calculators.
                    */

                    filterCalculators();


                    /*
                        Scroll to calculator
                        section.

                        Respect reduced-motion
                        accessibility preference.
                    */

                    if (
                        calculatorSection
                    ) {

                        const prefersReducedMotion =
                            window.matchMedia(
                                "(prefers-reduced-motion: reduce)"
                            ).matches;


                        calculatorSection.scrollIntoView({

                            behavior:
                                prefersReducedMotion
                                    ? "auto"
                                    : "smooth",

                            block:
                                "start"

                        });

                    }

                }
            );

        }
    );


    /*
        KEYBOARD SHORTCUT DISPLAY

        Mac:
        ⌘ K

        Windows / Linux:
        Ctrl K
    */

    const shortcutDisplay =
        document.querySelector(
            ".search-box kbd"
        );


    if (
        shortcutDisplay
    ) {

        const platform =
            navigator.userAgentData?.platform ||
            navigator.platform ||
            "";


        const isMac =
            /Mac|iPhone|iPad|iPod/i.test(
                platform
            );


        shortcutDisplay.textContent =
            isMac
                ? "⌘ K"
                : "Ctrl K";

    }


    /*
        KEYBOARD SHORTCUTS

        Command + K:
        macOS

        Ctrl + K:
        Windows / Linux
    */

    document.addEventListener(
        "keydown",
        function (event) {


            if (
                (
                    event.metaKey ||
                    event.ctrlKey
                ) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();


                searchInput.focus();


                searchInput.select();

            }


            /*
                ESCAPE KEY

                Clears search,
                clears category,
                and removes focus.
            */

            if (
                event.key === "Escape"
            ) {

                const hasSearch =
                    searchInput.value !== "";


                const hasCategory =
                    activeCategory !== "all";


                if (
                    hasSearch ||
                    hasCategory
                ) {

                    searchInput.value =
                        "";


                    activeCategory =
                        "all";


                    removeActiveCategory();


                    filterCalculators();

                }


                if (
                    document.activeElement ===
                    searchInput
                ) {

                    searchInput.blur();

                }

            }

        }
    );


    /*
        INITIAL PAGE LOAD
    */

    filterCalculators();

});