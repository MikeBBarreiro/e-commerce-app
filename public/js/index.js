$( document ).ready(function() {
    $(".dropdown-menu li a").click(function(){

        $(".bttn-dropdown > span").text($(this).text());
        $(".bttn-dropdown > span").val($(this).text());
  
     });
});

var productsChildComp = Vue.component('app-product', {
    props: ['search'],
    data: function(){
        return {
            totalPages: 0,
            current: 1,
            pageSize: 9,
            initialProducts: [],
            products: [],
            categories: [],
            sortBy: 'price',
            sortDirection: 'asc'
        }
    },
    mounted: function() {
        fetch('http://localhost:3000/getProducts')
        .then(res => res.json())
        .then((data) => {
            for(var i = 0; i < data.length; i++){
                data[i].price = '$' + data[i].price.toFixed(2);
                this.categories.push(data[i].category);
            }
            this.products = data;
            this.initialProducts = data;
            this.totalPagesOfProducts(this.products);

            $('.p-content').addClass('fade-in');
            $('.bottom').css('display', 'block');
        })
    },
    computed:{
        filteredProducts: {
            get: function() {

                return this.products.filter((product) => {
                    
                    if( this.search.split(':')[0] === 'tag'){
                        var t = this.search.split(':');
                        return product.category.match(t[1])
                    }else{
                        return product.name.toLowerCase().match(this.search.toLowerCase())
                    }
                });
            },
            set: function(newValue) {
                this.products = newValue;
            }
        },
        sortedProducts: {
            get: function(){},
            set: function(array) {
                console.log('sorting setter');
                var sortedArray = array.sort((a, b) => {
                    //acsen
                    var aInt = a.price.replace('$', '');
                    var bInt = b.price.replace('$', '');
                    return Number(aInt) - Number(bInt);
                });
                this.filteredProducts = sortedArray;
            }
        },
        indexStart() {
            return (this.current - 1) * this.pageSize;
        },
        indexEnd() {
            return this.indexStart + this.pageSize;
        },
        paginated() {
            //when this is altered, so is filtered products.. which will run its computed function.
            if(this.indexEnd === 0 || ''){
                return this.filteredProducts.slice(0, this.pageSize);
            }else{
                return this.filteredProducts.slice(this.indexStart, this.indexEnd)
            }
        }
    },
    methods:{
        totalPagesOfProducts: function(p) {
            var a = []
            for(var i = 0; i < p.length; i++){
                a.push(p[i]);
            
                if(a.length === 8 || p.length - 1 === i || a.length === p.length){
                    this.totalPages++
                    a = [];
                }
            }
        },
        sort: function(s){
            if(s === this.sortBy) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            }
            this.sortBy = s;
        },
        lowToHighSorter: function(){
            var mutatedArray = [...this.initialProducts];
            var sortedArray = mutatedArray.sort((a, b) => {
                //acsen from the inital products array so users can freely select categories
                var aInt = a.price.replace('$', '');
                var bInt = b.price.replace('$', '');
                return  Number(aInt) - Number(bInt);
            });

            this.filteredProducts = sortedArray;
        },
        highToLowSorter: function (){
            var mutatedArray = [...this.initialProducts];
            var sortedArray = mutatedArray.sort((a, b) => {
                //descend from the inital products array so users can freely select categories
                var aInt = a.price.replace('$', '');
                var bInt = b.price.replace('$', '');
                return  Number(bInt) - Number(aInt);
            });

            this.filteredProducts = sortedArray;
        },
        noSorting: function(){
            //set to initalized products
            this.$parent.productSearch = '';
            this.products = this.initialProducts;
        },
        prev() {
            if(this.current === 1){
                this.current = 1;
            }else{
                this.current--;
            }
        },
        next() {
            if(this.current === this.totalPages){
                return this.current;
            }else if(this.current > this.totalPages){
                this.current = this.totalPages;
            }else{
                this.current++;
            }
        }
    },
    template: 
    `<div>
        <div class="row" style="border-bottom: 1px solid lightgrey;">
            <div class="col-lg-4"></div>
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
                <div class="sort-by-container">
                    <div class="dropdown" style="float: right; padding: 20px 0 20px;">
                        <label> Sort By </label>
                        <button style="min-width: 145px;" class="btn bttn-dropdown dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <span>No Sort</span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li v-on:click="lowToHighSorter"><a class="dropdown-item" href="#">Low-high price</a></li>
                            <li v-on:click="highToLowSorter"><a class="dropdown-item" href="#">High-low price</a></li>
                            <li v-on:click="noSorting"><a class="dropdown-item" href="#">No Sort</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <nav class="pagination-container" role="navigation" aria-label="pagination">
                    <table class="pagination-list">
                        <tr>
                            <td>
                                <div class="prevPagination">
                                    <span @click="prev"> Prev </span>
                                </div>
                            </td>
                            <td>
                                <span> Page </span>
                                <input v-model="current" type="number" min="1" max="totalPages" class="pagination-link" />
                                <span> of {{totalPages}}</span>
                            </td>
                            <td>
                                <div class="nextPagination">
                                    <span @click="next()"> Next </span>
                                </div>
                            </td>
                            <td>
                                
                            </td>
                        </tr>
                    </table>
                </nav>
            </div>
        </div>

        <div class="row p-content">
            <div :span="3" class="col-md-6 col-lg-4" v-for="product in paginated" style="display: flex; flex-wrap: wrap;">
                <div class="singleProduct">
                    <div class="product-image-container">
                        <img :src="product.image" />
                    </div>
                    
                    <span class="product-price">{{product.price}} </span>
                    <span class="product-name">{{product.name}}</span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <nav class="pagination-container" role="navigation" aria-label="pagination">
                    <table class="pagination-list bottom" style="display: none;">
                        <tr>
                            <td>
                                <div class="prevPagination">
                                    <span @click="prev"> Prev </span>
                                </div>
                            </td>
                            <td>
                                <span> Page </span>
                                <input v-model="current" type="number" min="1" class="pagination-link" />
                                <span> of {{totalPages}}</span>
                            </td>
                            <td>
                                <div class="nextPagination">
                                    <span @click="next()"> Next </span>
                                </div>
                            </td>
                            <td>
                                
                            </td>
                        </tr>
                    </table>
                </nav>
            </div>
        </div>
    </div>`,
    beforeCreate: () => {},
    create: () => {},
    beforeMounted: () => {},
    beforeDestroy: () => {},
    destroy: () => {},
});

new Vue({
    el: '#app',
    components: {
        'products-child-component': productsChildComp
    },
    data: {
        productSearch: ''
    },
    methods: {
        inputSearchProductClick: function(event){
            this.productSearch = ''
        },
        productSearchClothing: function(event) {
            this.productSearch = 'tag:clothing';
        },
        productSearchShoes: function(event) {
            this.productSearch = 'tag:shoes';
        },
        productSearchAccessories: function(event) {
            this.productSearch = 'tag:accessories';
        },
        productSearchBaby: function(event) {
            this.productSearch = 'tag:baby';
        },
        productSearchHome: function(event) {
            this.productSearch = 'tag:home';
        },
        productSearchToys: function(event) {
            this.productSearch = 'tag:toys';
        },
        productSearchViewAll: function(event) {
            // `event` is the native DOM event
            this.productSearch = '';
        }
    },
    updated: function() {
        //was a sort button selected? check here after the DOM is updated to apply sortting logic.
        if($(".bttn-dropdown > span").text() === 'Low-high price'){
            this.$refs.productsChildComp.lowToHighSorter()
        }else if($(".bttn-dropdown > span").text() === 'High-low price'){
            this.$refs.productsChildComp.highToLowSorter();
        }
        
        this.$refs.productsChildComp.totalPages = 0;
        this.$refs.productsChildComp.totalPagesOfProducts(this.$refs.productsChildComp.filteredProducts);
    }
})


