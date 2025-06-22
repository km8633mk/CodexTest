const mealForm = document.getElementById('meal-form');
const mealList = document.getElementById('meal-list');
const totalCaloriesSpan = document.getElementById('total-calories');
let totalCalories = 0;

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

    totalCalories += calories;
    totalCaloriesSpan.textContent = totalCalories;

    nameInput.value = '';
    caloriesInput.value = '';
});
