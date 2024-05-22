/// TUTORIAL ///
const start_responses = {
    "greeting": "Hello there! How are you doing today?",
    "greeting_response": {
        "positive": "That's good. What is your name?",
        "negative": "Oh, I hope you feel better soon. What's your name?"
    },
    "name": "Oh, hello. It's nice to meet you.",
    "question1": "I have a question for you. Do you like fish?",
    "question1_response": {
        "positive": "That's cool.",
        "negative": "That's sad."
    },
    "goodbye": "Alright, I'm done leading the conversation. It's your turn to converse with me. Have fun!"
}

let greeting_response = prompt(start_responses.greeting); let your_name;

if (greeting_response === "Good" || greeting_response === "good" || greeting_response === "okay" || greeting_response === "Okay") {
    your_name = prompt(start_responses.greeting_response.positive);
} else {your_name = prompt(start_responses.greeting_response.negative);}

start_responses.name = "Oh, hello " + your_name + ". It's nice to meet you.";
alert(start_responses.name);
let fish = prompt(start_responses.question1);

if (fish === "yes" || fish === "Yes" || fish === "sure" || fish === "Sure" || fish === "yeah" || fish === "Yeah") {
    alert(start_responses.question1_response.positive);
} else {
    alert(start_responses.question1_response.negative);
} alert(start_responses.goodbye);

const createMessage = (type, message) => {

}