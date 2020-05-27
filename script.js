const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealEL = document.getElementById('single-meal');

// Search meal, Fetch from API

function searchMeal(e) {
  e.preventDefault(); //its used to prevent the input to submit to a file

  //Clear single meal 
  single_mealEL.innerHTML = '';
  //Get search term
  const term = search.value;
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search result for: ${term}</h2>`

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no seach results. Try again </p>`;
        } else {
          mealsEl.innerHTML = data.meals.map(meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `)
            .join('');
        }
      });
    //clear search text
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
}

// Fetch meal by ID

function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(resp => resp.json())
    .then(data => {
      const meal = data.meals[0];
     
      addMealToDOM(meal);
    });
}
// Fetch random meal

function getRandomMeal(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(resp => resp.json())
    .then(data => {
      const randonMeal = data.meals[0];
      resultHeading.innerHTML = '';
      mealsEl.innerHTML = '';
      addMealToDOM(randonMeal);
    });
}

//Add meal to the DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; 1 <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }  

  single_mealEL.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>      
      <div class="main">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>        
      </div>
    </div>
  `;
  
}

//Even Listener

submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => { //search thouhg the elemenets of the parent
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }
});