const mealForm = document.getElementById('meal-form');
const mealList = document.getElementById('meal-list');
const totalCaloriesSpan = document.getElementById('total-calories');

// Load meals from localStorage or start with an empty array
let meals = JSON.parse(localStorage.getItem('meals')) || [];
let totalCalories = 0;

// Render saved meals on startup
meals.forEach(({ name, calories }) => {
    const li = document.createElement('li');
    li.textContent = `${name} - ${calories} kcal`;
    mealList.appendChild(li);
    totalCalories += calories;
});
totalCaloriesSpan.textContent = totalCalories;

mealForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const nameInput = document.getElementById('meal-name');
    const caloriesInput = document.getElementById('meal-calories');

    const name = nameInput.value.trim();
    const calories = parseInt(caloriesInput.value, 10);
    if (!name || isNaN(calories)) {
        return;
    }

    const li = document.createElement('li');
    li.textContent = `${name} - ${calories} kcal`;
    mealList.appendChild(li);

    // Save new meal
    meals.push({ name, calories });
    localStorage.setItem('meals', JSON.stringify(meals));

    totalCalories += calories;
    totalCaloriesSpan.textContent = totalCalories;

    nameInput.value = '';
    caloriesInput.value = '';
});
