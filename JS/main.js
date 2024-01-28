/// <reference types="../@types/jquery" />
const displayData = document.getElementById("desplayData");
const searchContainer = document.getElementById("search-Container");

$(async function() {
   await searchName("")
   $("#outSide-loading").fadeOut(300 , function() {
      $("#outSide-loading").remove()
      $("body").css({ overflow : 'auto'});
   })
})
$("#linksBtn").on("click", function () {
   if($("#linksBtn").hasClass("fa-bars")) {
      openSideNav()
   } else {
      closeSideNav()
   }
});
let links = document.querySelectorAll('#side-links .links li')
function openSideNav() {
  $(".side-nav").animate({ left: "0" }, 500);
  $("#linksBtn").addClass("fa-xmark");
  $("#linksBtn").removeClass("fa-bars");
for (let i = 0; i < links.length; i++) {
  $(links)
    .eq(i).delay((i + 1) * 120)
    .animate({ top: i * 40 }, (i + 1) * 90);
}
 }
function closeSideNav() {
  $(".side-nav").animate({ left: "-250px" }, 500);
   $("#linksBtn").addClass("fa-bars");
   $("#linksBtn").removeClass("fa-xmark");
   for (let i = links.length; i >= 0; i--) {
     $(links)
       .eq(i)
       .animate({ top: '100%' }, (5 - i) * 150);
   }
}

$("#SearchBtn").on("click" , function() {
   showSearch()
   closeSideNav()
})
$("#CategoriesBtn").on("click", function () {
  getCategory();
  closeSideNav();
  hideElement(searchContainer);
});
$("#areaBtn").on("click", function () {
  getArea();
  closeSideNav();
  hideElement(searchContainer);
});
$("#ingredientsBtn").on("click", function () {
  getIngredient();
  closeSideNav();
  hideElement(searchContainer);
});
$("#contactBtn").on("click", function () {
  showContact();
  closeSideNav();
  hideElement(searchContainer);
});

async function searchName(MealsName) {
   showLoading()
   let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${MealsName}`);
   let mailsData = await response.json()
   displayMeals(mailsData.meals);
}
async function searchFirstLetter(MealsFL) {
   showLoading();
   MealsFL == "" ? MealsFL = "a" : MealsFL = MealsFL
   let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${MealsFL}`);
   let mailsData = await response.json();
   displayMeals(mailsData.meals);
}
function displayMeals(mealsArray) {
   let box = ''
   for (let i = 0; i < mealsArray.length; i++) {
     box += `
            <div class="col-md-3 my-3" onclick="mealDetails(${mealsArray[i].idMeal})">
            <div class="meal overflow-hidden position-relative">
            <img src="${mealsArray[i].strMealThumb}" class="w-100 rounded-2" alt="meal">
            <div class="overlay position-absolute w-100 h-100">
            <h3>${mealsArray[i].strMeal}</h3>
            </div>
            </div>
         </div>
      `;
   }
   displayData.innerHTML = box
}

async function mealDetails(id) {
   showLoading()
   let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
   let mealData = await response.json()
   let recipesCount = 0
   let recipes = ''
   let dataKeys = Object.keys(mealData.meals[0]);
   for(let i = 0 ; i<dataKeys.length ; i++) {
      if ( dataKeys[i].startsWith("strIngredient") && mealData.meals[0][dataKeys[i]] != "") {
         recipesCount++
         recipes += `
         <li>${mealData.meals[0][`strMeasure${recipesCount}`]} ${
         mealData.meals[0][`strIngredient${recipesCount}`]
         }</li>
         `;
      }  
   }
   
   let tags = mealData.meals[0].strTags
   tags ? tags = tags.split(",") : tags=0
   tagsContent = ''
   for(let i = 0 ; i < tags.length ; i++) {
      tagsContent += `
      <li>${tags[i]}</li>
      `;
      }
   let box = `
   <div class="meal-details">
   
         <div class="col-md-4">
         <div>
            <img class="w-100 rounded-2" src="${mealData.meals[0].strMealThumb}" alt="${mealData.meals[0].strMeal}">
            <h3 class="fs-2">${mealData.meals[0].strMeal}</h3>
         </div>
         </div>
         <div class="col-md-8">
         <div>
            <h4 class="fs-2">Instructions</h4>
            <p>${mealData.meals[0].strInstructions}</p>
            <ul class="meal-info">
               <li class="fs-3"><span class="fw-bold">Area :</span> ${mealData.meals[0].strArea}</li>
               <li class="fs-3"><span class="fw-bold">Category :</span> ${mealData.meals[0].strCategory}</li>
               <li class="fs-3"><span class="fw-medium">Recipes :</span>
               <ul class="d-flex flex-wrap Recipes-meal">
                  ${recipes}
               </ul>
               </li>
               <li class="fs-3"><span class="fw-medium">Tags :</span>
               <ul class="d-flex flex-wrap flags-meal">
                  ${tagsContent}
               </ul>
               </li>
            </ul>
               <a class="btn btn-success" target="_blank" href="${mealData.meals[0].strSource}">Source</a>
               <a class="btn btn-danger" target="_blank" href="${mealData.meals[0].strYoutube}">YouTube</a>
         </div>
         </div>
   
   </div>
   `;
   displayData.innerHTML = box;
}
function showLoading() {
  displayData.innerHTML = ` <div class="loading" id="inSide-loading">
        <span class="loader"></span>
      </div>`;
}
function showSearch() {
   closeSideNav()
   displayData.innerHTML = ''
   searchContainer.innerHTML = `
            <div class="col-md-6">
         <div class="py-4">
               <input type="text" oninput="searchName(this.value)" placeholder="Search By Name" class="w-100 inp-search">
         </div>
         </div>
         <div class="col-md-6">
         <div class="py-4">
               <input type="text" oninput="searchFirstLetter(this.value)" maxlength="1" placeholder="Search By First Letter" class="w-100 inp-search">
         </div>
         </div>
   `;
}

async function getCategory() {
   showLoading()
   let response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
   let CategoryData = await response.json()
   showCategory(CategoryData.categories);
}

function showCategory(CategoryArray) {
   let box = ''
   for(let i = 0 ; i < CategoryArray.length ; i++) {
      let Description = CategoryArray[i].strCategoryDescription;
      let shortDescription = Description.split(" ").slice(0, 20);
      box += `
            <div class="col-md-3 my-3" onclick="mealsByCate('${CategoryArray[i].strCategory}')">
            <div class="cate overflow-hidden position-relative">
            <img src="${CategoryArray[i].strCategoryThumb}" 
            class="w-100 rounded-2" alt="${CategoryArray[i].strCategory}">
            <div class="overlay text-center rounded-2 position-absolute w-100 h-100">
            <h3>${CategoryArray[i].strCategory}</h3>
            <p>${shortDescription.join(" ")}</p>
            </div>
            </div>
         </div>
      
      `;
   }
   displayData.innerHTML = box
}

async function mealsByCate(cateName) {
   showLoading()
   let response = await fetch(
     `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cateName}`
   );
   let mealsDate = await response.json()
   
   displayMeals(mealsDate.meals.slice(0 , 20))
}

function hideElement(e) {
e.innerHTML = ""
}

async function getArea() {
   showLoading()
   let response = await fetch(
     "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
   );
   let areaDate = await response.json()
   showArea(areaDate.meals);
}
function showArea(areaArray) {
   closeSideNav()
   let box = ''
   for (let i = 0; i < areaArray.length; i++) {
      box += `
      <div class="col-md-3 my-3" onclick="mealsByArea('${areaArray[i].strArea}')">
         <div class="area text-center">
            <i class="fa-solid fa-house-laptop area-icon"></i>
            <h4>${areaArray[i].strArea}</h4>
         </div>
      </div>
      `;
   }
   displayData.innerHTML = box
}
async function mealsByArea(areaName) {
   showLoading()
   let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`)
   let mealsData = await response.json()
   displayMeals(mealsData.meals.slice(0 , 20));
}
async function getIngredient() {
   showLoading()
   let response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
   let ingredientData = await response.json()
   showIngredient(ingredientData.meals.slice(0 , 20));
}
function showIngredient(ingredientArray) {
   let box = "";
   for (let i = 0; i < ingredientArray.length; i++) {
      let description = ingredientArray[i].strDescription;
      let shortDescription = description.split(" ").slice(0 , 20)
     box += `
         <div class="col-md-3 my-3" onclick="mealsByIngredient('${ingredientArray[i].strIngredient}')">
            <div class="Ingredient text-center">
               <i class="fa-solid fa-drumstick-bite"></i>
               <h4>${ingredientArray[i].strIngredient}</h4>
               <p>${shortDescription.join(" ")}</p>
            </div>
         </div>
   `;
   }
   displayData.innerHTML = box;
}

async function mealsByIngredient(ingredientName) {
   showLoading()
   let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`)
   let mealsData = await response.json()
   displayMeals(mealsData.meals)
}



let validForm = {
      validName : false,
      validEmail : false,
      validPhone : false,
      validAge : false,
      validPassword : false,
      validRePassword : false,
}
let nameRegex = /^[A-Za-z]{3,}$/
let emailRegex = /^[\w-]+(\.[\w-]+)*@[A-Za-z]+(\.[A-Za-z]+)*(\.[A-Za-z]{2,})$/;
let phoneRegex = /^01(1|2|5|0)\d{8}$/
let ageRegex = /^(1[8-9]|[2-7][0-9]|80)$/;
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/


function checkRePassword() {
   let rePassInput = $("#inpRePass");

   if (rePassInput.val() != "") {

      if ($(rePassInput).val() == $("#inpPass").val()) {
        $(rePassInput).next().addClass("d-none");
        validForm.validRePassword = true;
        enableForm();
      } else {
        $(rePassInput).next().removeClass("d-none");
        validForm.validRePassword = false;
        enableForm();
      }


   }
}


function checkValidation(input , regex , prop) {
   if (regex.test(input.value)) {
      validForm[prop] = true;
      enableForm()
      $(input).next().addClass("d-none")
   } else {
      validForm[prop] = false;
      enableForm()
      $(input).next().removeClass("d-none");
   }
}

function enableForm() {
   if (
     validForm.validName &&
     validForm.validEmail &&
     validForm.validPhone &&
     validForm.validAge &&
     validForm.validPassword &&
     validForm.validRePassword
   ) {
      $("#btnSubmit").removeAttr("disabled");
   } else {
      $("#btnSubmit").attr("disabled" , true);
   }
}

function showContact() {
  displayData.innerHTML = `
   
   
                 <form action="" class="form-container col-md-9 mx-auto ">
                <div class="row w-100">
                  <div class="col-md-6 mb-4">
                    <div>
                      <input id="inpName" oninput="checkValidation(this , ${nameRegex} , 'validName')" type="text" name="userName" class="w-100 form-control" placeholder="Enter Your Name">
                      <div class="alert alert-danger text-center mt-2 d-none" role="alert">At least 3 letters And Special characters and numbers not allowed</div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div>
                      <input id="inpEmail" oninput="checkValidation(this , ${emailRegex} , 'validEmail')" type="email" name="email"  class="w-100 form-control" placeholder="Enter Your Email">
                      <div class="alert alert-danger text-center mt-2 d-none" role="alert">Email not valid *exemple@yyy.zzz</div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div>
                      <input id="inpPhone" oninput="checkValidation(this , ${phoneRegex}, 'validPhone')" type="tel" name="phone"  class="w-100 form-control" placeholder="Enter Your Phone">
                      <div class="alert alert-danger text-center mt-2 d-none" role="alert">Enter valid Phone Number</div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div>
                      <input id="inpAge"   oninput="checkValidation(this , ${ageRegex}, 'validAge')" type="number" name="age"  class="w-100 form-control" placeholder="Enter Your Age">
                      <div class="alert alert-danger text-center mt-2 d-none" role="alert">Enter valid age</div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div>
                      <input id="inpPass"   oninput="checkValidation(this , ${passwordRegex}, 'validPassword') ; checkRePassword()" type="password" name="password"  class="w-100 form-control" placeholder="Enter Your Password">
                      <div class="alert alert-danger text-center mt-2 d-none" role="alert">Enter valid password *Minimum eight characters, at least one letter and one number and one Special characters:*</div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div>
                      <input id="inpRePass" oninput="checkRePassword() " type="password" name="password"  class="w-100 form-control" placeholder="RePassword">
                      <div class="alert alert-danger text-center mt-2 d-none" role="alert">Enter valid RePassword</div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div>
                      <button id="btnSubmit" type="button" class="btn btn-outline-danger mx-auto d-block" disabled>Submit</button>
                    </div>
                  </div>
                </div>
              </form>
   
   `;
}

