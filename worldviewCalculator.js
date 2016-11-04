//TODO: initialize the question arrays from .txt files (better data struct), this should be php, ask gary for server access / config info
//TODO: read number of questions from html
//TODO: object for each world view, contains the questions
//TODO: display the results of which world views you didn't check
//TODO: break down world view by category of questions
//TODO: button to print the results out to a pdf
//TODO: statements checked vs statement checked.
//TODO: case when all statements are checked, none are checked, none are checked within a section... (should I even worry about these)
//TODO: implement jquery everytime selectors are used.
//TODO: ensure javascript closures and variable scopes are properly used in windows.onload
//TODO: client side rendering vs server side rendering

"use strict";

(function() {
    const MONISM_ANSWER_KEY = [ // Each array is a question. Each question has a bunch of statements which align to each worldview
        [2],
        [3, 4],
        [1, 2, 6],
        [2],
        [3],
        [1, 3, 4],
        [],
        [5],
        [6],
        [5],
        [2],
        [],
        [1],
        [3, 4],
        [3],
        [3, 4],
        [3],
        [3, 4],
        [4],
        [3],
        [1, 4],
        [4],
        [4],
        [6],
        [],
        [3],
        [3],
        [4],
        [1, 3],
        [2, 3, 5],
        [2, 3],
        [3],
        [2],
        [3],
        [2, 5, 6, 10]
    ];
    const NATURALISM_ANSWER_KEY = [
        [3],
        [5],
        [8],
        [3],
        [4],
        [1],
        [2, 4, 6],
        [1, 4],
        [1, 3, 5],
        [1, 4],
        [1],
        [1, 3],
        [2],
        [2],
        [4],
        [1, 4],
        [1],
        [1],
        [1, 3],
        [2],
        [3],
        [2, 3, 6],
        [1],
        [1, 3, 5],
        [1, 4, 5, 6],
        [1],
        [1],
        [2, 3],
        [2],
        [4],
        [1],
        [1],
        [3, 4],
        [2],
        [1, 3, 6, 7, 9]
    ];
    const THEISM_ANSWER_KEY = [
        [1],
        [1, 2],
        [3, 4, 5, 7],
        [1],
        [1, 2],
        [2],
        [1, 3, 5],
        [2, 3],
        [2, 4],
        [2, 3],
        [3],
        [2],
        [3],
        [1],
        [1, 2],
        [2],
        [2],
        [2],
        [2],
        [1],
        [2],
        [1, 5],
        [2, 3],
        [2, 4],
        [2, 3],
        [2],
        [2],
        [1],
        [1, 4],
        [1],
        [4],
        [2],
        [1],
        [1],
        [4, 8, 11, 12]
    ];
    window.onload = function() {
        $("#numberOfQuestions").text(MONISM_ANSWER_KEY.length);
        $("#backToTopButton").click(function() {
            scrollToElement("#header", 700);
        });
        var questionSets = document.querySelectorAll(".questionSet");
        for (var i = 0; i < questionSets.length; i++) {
            (function(i) {
                var headerSelector = "#" + questionSets[i].id + " h3";
                $(headerSelector).click(function() {
                    scrollToElement(headerSelector, 200);
                });
            })(i);
        }
        $("#submitButton").click(submitResults);
        $("#hideResultsButton").click(hideResults);
    }

    // Calculates how many of the questions answered contribute to each worldview
    function submitResults() {
        function worldviewData() {
            this.god = 0;
            this.reality = 0;
            this.knowledge = 0;
            this.humankind = 0;
            this.ethics = 0;
            this.generalStatements = 0;
            this.total = 0;
            this.remaining = 0;
        }
        var results = {
            statementsChecked: 0,
            questionsAnswered: 0,
            monism: new worldviewData,
            naturalism: new worldviewData,
            theism: new worldviewData,
        }
        var questionSets = document.querySelectorAll(".questionSet");
        var questionIndex = 0;
        for (var i = 0; i < questionSets.length; i++) {
            var questionSet = questionSets[i];
            var questions = document.querySelectorAll("#" + questionSet.id + " ul");
            for (var j = 0; j < questions.length; j++) {
                var statementChecked = false;
                var question = questions[j];
                for (var statementIndex = 0; statementIndex < question.children.length; statementIndex++) {
                    var statement = question.children[statementIndex].firstChild;
                    if (statement.checked) {
                        statementChecked = true;
                        if (MONISM_ANSWER_KEY[questionIndex].indexOf(statementIndex + 1) > -1) {
                            results.statementsChecked++;
                            results.monism.total++;
                            results.monism[questionSet.id]++;
                        }
                        if (NATURALISM_ANSWER_KEY[questionIndex].indexOf(statementIndex + 1) > -1) {
                            results.statementsChecked++;
                            results.naturalism.total++;
                            results.naturalism[questionSet.id]++;
                        }
                        if (THEISM_ANSWER_KEY[questionIndex].indexOf(statementIndex + 1) > -1) {
                            results.statementsChecked++;
                            results.theism.total++;
                            results.theism[questionSet.id]++;
                        }
                    }
                }
                questionIndex++;
                if (statementChecked) {
                    results.questionsAnswered++;
                }
            }
        }
        results.monism.remaining = getNumberOfStatements(MONISM_ANSWER_KEY) - results.monism.total;
        results.naturalism.remaining = getNumberOfStatements(NATURALISM_ANSWER_KEY) - results.naturalism.total;
        results.theism.remaining = getNumberOfStatements(THEISM_ANSWER_KEY) - results.theism.total;
        displayResults(results);
    }

    // Displays the results of the survey
    function displayResults(results) {
        $("#results").css("display", "block");
        $("#hideResultsButton").css("display", "inline");
        scrollToElement("#buttonsDiv", 500);

        $("#questionsAnswered").text(results.questionsAnswered);
        $("#statementsChecked").text(results.statementsChecked);

        $("#monismStatements").text(results.monism.total);
        $("#naturalismStatements").text(results.naturalism.total);
        $("#theismStatements").text(results.theism.total);

        $("#remainingMonismStatements").text(results.monism.remaining);
        $("#remainingNaturalismStatements").text(results.naturalism.remaining);
        $("#remainingTheismStatements").text(results.theism.remaining);

        var questionSets = document.querySelectorAll(".questionSet");
        var spans = document.querySelectorAll("#resultsSectionAlignments span");
        for (var i = 0; i < questionSets.length; i++) {
            var questionSet = questionSets[i];
            spans[3 * i + 0].innerText = results.monism[questionSet.id];
            spans[3 * i + 1].innerText = results.naturalism[questionSet.id];
            spans[3 * i + 2].innerText = results.theism[questionSet.id];
        }
        displayCharts(results);
    }

    // Clears previous charts and displays new charts
    function displayCharts(results) {
        var chartDivs = document.querySelectorAll(".chartDiv");
        for (var i = 0; i < chartDivs.length; i++) {
            chartDivs[i].innerText = "";
        }
        if (results.questionsAnswered != 0) {
            for (var i = 0; i < chartDivs.length; i++) {
                var chartDiv = chartDivs[i];
                var canvas = document.createElement("canvas");
                canvas.width = $(chartDiv).width();
                canvas.height = $(chartDiv).height();
                chartDiv.appendChild(canvas);
            }
            require(["lib/chart.js"], function(Chart) {
                Chart.defaults.global.legend.display = false;
                Chart.defaults.global.defaultFontSize = 15;
                var canvases = document.querySelectorAll("canvas");
                var chartDataSets = loadChartData(results);
                for (var i = 0; i < canvases.length; i++) {
                    var canvas = canvases[i];
                    var myChart = new Chart(canvas, chartDataSets[i]);
                }
            })
        }
    }

    // Loads the results into charts and returns them as an array of chartData objects (the second parameter in Chart constructor)
    function loadChartData(results) {
        return [
            getPieChartData(results.monism.total, results.naturalism.total, results.theism.total),
            getPieChartData(results.monism.remaining, results.naturalism.remaining, results.theism.remaining),
            getPieChartData(results.monism.god, results.naturalism.god, results.theism.god),
            getPieChartData(results.monism.reality, results.naturalism.reality, results.theism.reality),
            getPieChartData(results.monism.knowledge, results.naturalism.knowledge, results.theism.knowledge),
            getPieChartData(results.monism.humankind, results.naturalism.humankind, results.theism.humankind),
            getPieChartData(results.monism.ethics, results.naturalism.ethics, results.theism.ethics),
            getPieChartData(results.monism.generalStatements, results.naturalism.generalStatements, results.theism.generalStatements),
        ]
    }

    // Returns a pie chart with monismResult, naturalismResult, theismResult as the dataset
    function getPieChartData(monismResult, naturalismResult, theismResult) {
        return {
            type: "pie",
            data: {
                labels: ["Monism", "Naturalism", "Theism"],
                datasets: [{
                    data: [monismResult, naturalismResult, theismResult],
                    backgroundColor: ["rgb(61, 69, 255)", "rgb(114, 255, 111)", "rgb(255, 96, 96)"],
                    borderWidth: 0
                }]
            }
        }
    }

    // Returns the number of elements in the jagged array worldviewAnswerKey
    function getNumberOfStatements(worldviewAnswerKey) {
        var numOfStatements = 0;
        for (var i = 0; i < worldviewAnswerKey.length; i++) {
            numOfStatements += worldviewAnswerKey[i].length;
        }
        return numOfStatements;
    }

    // Hides the results div
    function hideResults() {
        $("#results").css("display", "none");
        $("#hideResultsButton").css("display", "none");
    }

    // Scrolls to the top of ElementSelector using timeTaken milliseconds
    function scrollToElement(elementSelector, timeTaken) {
        if ($(elementSelector).offset().top - document.body.scrollTop != 0) {
            $('html, body').animate({
                scrollTop: $(elementSelector).offset().top
            }, timeTaken);
        }
    }
})();
