class Item {
    constructor(name, quantity) {
        this.name = name;
        this.quantity = quantity;
    }

    toString() {
        return `Item: ${this.name}, ${this.quantity}`;
    }

    static init(name, quantity) {
        name = name.trim();
        if (   quantity <= 0
            || name.length === 0
        ) {
            return null; 
        }

        return new Item(name, quantity);
    }

}

// new Item("Keyaboard", 2), new Item("Head phones", 1), new Item("Halo skin", 1)
let items_cart   = [];
let items_bought = [];

const cart_menu        = document.querySelector(".left_menu");
const left_to_buy_menu = document.querySelector(".left_to_buy_box");
const bought_menu      = document.querySelector(".already_bought_box");


function store_data() {
    localStorage.setItem('cart_items',   JSON.stringify(items_cart));
    localStorage.setItem('bought_items', JSON.stringify(items_bought));
}

console.log("Cart: ",   items_cart);
console.log("Bought: ", items_bought);

// Load cart items
const j_cart_items = localStorage.getItem('cart_items');
if (j_cart_items) {
    items_cart = JSON.parse(j_cart_items);
}

// Create product rows for cart items (unbought items)
items_cart.forEach(item => {
    console.log("Loading cart item:", item);
    cart_menu.appendChild(create_product_row(item));
});
    



document.getElementById('search_box_input').addEventListener('keydown', (event) => {
    if (event.type === "keydown") {
        if (event.key === "Escape") {
            event.target.blur();
            return;
        }
    }
});

document.getElementById('Add_button').addEventListener('mousedown', (event) => {
    if (event.type === 'mousedown') {
        event.preventDefault();
        return;
    }
});

document.getElementById('Add_button').addEventListener('click', handle_button_event);
function handle_button_event(event) {
    const text_input        = document.getElementById('search_box_input');
    const possible_new_item = Item.init(text_input.value, 1);

    if (   possible_new_item !== null 
        && !items_cart.some(item => item.name === possible_new_item.name)
    ) {
        items_cart.push(possible_new_item);
        cart_menu.appendChild(create_product_row(possible_new_item));
        text_input.value = '';
    } else if (text_input.value === ''){
        text_input.focus();
    }
    else { // Invalid
        text_input.value = '';
        text_input.focus();
    }

    store_data();

}

document.addEventListener('click', (event) => {
    if (event.target.closest('.bought_status')) {
        console.log("PRESSED");

        const product_row   = event.target.closest('.product_row');
        const product_name  = product_row.id.replace('product_row_', '');
        const bought_status = event.target.closest('.bought_status');
        const status_p      = bought_status.querySelector('p');
        const minus_button  = product_row.querySelector('.add_remove_items_menu .minus_circle_button');
        const plus_button   = product_row.querySelector('.add_remove_items_menu .plus_circle_button');
        
        if (status_p.textContent.trim() === 'Не куплено') {
            const item_index = items_cart.findIndex(item => item.name === product_name);
            
            if (item_index !== -1) {
                const item = items_cart[item_index];
                
                items_cart.splice(item_index, 1);
                
                items_bought.push(item);
                
                status_p.textContent = 'Куплено';

                minus_button.style.opacity = '0%';
                plus_button.style.opacity = '0%';

                const remove_from_cart_button = 
                    product_row.querySelector('.status_and_remove_menu > .bought_button');
                remove_from_cart_button.style.display = 'none';
                
                remove_item_from_left_to_buy(product_name);
                
                add_item_to_bought_list(item);
            }
        } else if (status_p.textContent.trim() === 'Куплено') {
            const item_index = items_bought.findIndex(item => item.name === product_name);
            
            if (item_index !== -1) {
                const item = items_bought[item_index];
                
                items_bought.splice(item_index, 1);
                
                items_cart.push(item);
                
                status_p.textContent = 'Не куплено';

                minus_button.style.opacity = '100%';
                plus_button.style.opacity = '100%';

                if (item.quantity == 1) {
                    minus_button.style.opacity = '30%';
                }

                const remove_from_cart_button = 
                    product_row.querySelector('.status_and_remove_menu > .bought_button');
                remove_from_cart_button.style.display = '';
                
                remove_item_from_bought_list(product_name);
                
                add_item_to_left_to_buy(item);
            }
        }

        store_data();

    }
});

function add_item_to_left_to_buy(item) {
    const left_to_buy_list = document.querySelector('.list_of_items_left');
    left_to_buy_list.appendChild(create_item_left(item));
}

function remove_item_from_left_to_buy(product_name) {
    const left_to_buy_list = document.querySelector('.list_of_items_left');
    const item_elements    = left_to_buy_list.querySelectorAll('.item_left');
    
    item_elements.forEach(item_element => {
        const item_text = item_element.querySelector('p').textContent.trim();
        if (item_text === product_name) {
            item_element.remove();
        }
    });
}

function add_item_to_bought_list(item) {
    const bought_list = document.querySelector('.list_of_bought_items');
    bought_list.appendChild(create_item_bought(item));
}

function remove_item_from_bought_list(product_name) {
    const bought_list = document.querySelector('.list_of_bought_items');
    const item_elements = bought_list.querySelectorAll('.item_bought');
    
    item_elements.forEach(item_element => {
        const item_text = item_element.querySelector('p').textContent.trim();
        if (item_text === product_name) {
            item_element.remove();
        }
    });
}

function create_item_left(item) {
    const item_div = document.createElement('div');
    item_div.className = 'item_left';
    
    const item_p = document.createElement('p');
    item_p.textContent = item.name;
    
    const circle_div = document.createElement('div');
    circle_div.className = 'circle';
    const circle_p = document.createElement('p');
    circle_p.textContent = item.quantity;
    circle_div.appendChild(circle_p);
    
    item_div.appendChild(item_p);
    item_div.appendChild(circle_div);
    
    return item_div;
}

function create_item_bought(item) {
    const item_div = document.createElement('div');
    item_div.className = 'item_bought';
    
    const item_p = document.createElement('p');
    item_p.textContent = item.name;
    
    const circle_div = document.createElement('div');
    circle_div.className = 'circle';
    const circle_p = document.createElement('p');
    circle_p.textContent = item.quantity;
    circle_div.appendChild(circle_p);
    
    item_div.appendChild(item_p);
    item_div.appendChild(circle_div);
    
    return item_div;
}

document.getElementById('search_box_input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('Add_button').click();
    }
});

// Bought_button
document.addEventListener('click', (event) => {
    if (event.target.closest('.bought_button')) {
        const product_row = event.target.closest('.product_row');
        const product_name = product_row.id.replace('product_row_', '');

        // Check if item is in cart first (since bought_button is for removing from cart)
        const item_index = items_cart.findIndex(item => item.name === product_name);

        if (item_index !== -1) {
            items_cart.splice(item_index, 1);
            product_row.remove();
            
            // Also remove from left-to-buy list
            remove_item_from_left_to_buy(product_name);
        }
    }

    store_data();
});

function create_product_row(item) {
    const product_row = document.createElement('div');
    product_row.className = 'product_row';
    product_row.id = `product_row_${item.name}`;

    const product_name_wrapper = document.createElement('div');
    product_name_wrapper.className = 'product_name_wrapper';
    const product_name_p = document.createElement('p');
    product_name_p.textContent = item.name;
    product_name_wrapper.appendChild(product_name_p);

    const add_remove_menu = document.createElement('div');
    add_remove_menu.className = 'add_remove_items_menu';

    const minus_button = document.createElement('button');
    minus_button.className = 'minus_circle_button';
    minus_button.setAttribute('data-tooltip', 'Minus Button');
    minus_button.textContent = ' - ';

    if (item.quantity === 1) {
        minus_button.style.opacity = '30%';
    }
    else {
        minus_button.style.opacity = '100%';
    }

    const n_items_div = document.createElement('div');
    n_items_div.className = 'n_items';
    const n_items_p = document.createElement('p');
    n_items_p.textContent = ` ${item.quantity} `;
    n_items_div.appendChild(n_items_p);

    const plus_button = document.createElement('button');
    plus_button.className = 'plus_circle_button';
    plus_button.setAttribute('data-tooltip', 'Plus Button');
    plus_button.textContent = ' + ';

    add_remove_menu.appendChild(minus_button);
    add_remove_menu.appendChild(n_items_div);
    add_remove_menu.appendChild(plus_button);

    const status_remove_menu = document.createElement('div');
    status_remove_menu.className = 'status_and_remove_menu';

    const bought_button = document.createElement('button');
    bought_button.className = 'bought_status';
    bought_button.setAttribute('data-tooltip', 'Toggle bought status');
    const bought_p = document.createElement('p');
    bought_p.textContent = 'Не куплено';
    bought_button.appendChild(bought_p);

    const cross_div = document.createElement('div');
    cross_div.className = 'bought_button';
    cross_div.setAttribute('data-tooltip', 'Remove from cart');
    const cross_p = document.createElement('p');
    cross_p.textContent = 'x';
    cross_div.appendChild(cross_p);

    status_remove_menu.appendChild(bought_button);
    status_remove_menu.appendChild(cross_div);

    product_row.appendChild(product_name_wrapper);
    product_row.appendChild(add_remove_menu);
    product_row.appendChild(status_remove_menu);

    const left_to_buy_list = document.querySelector('.list_of_items_left');
    left_to_buy_list.appendChild(create_item_left(item));

    return product_row;
}

// Plus, Minus buttons
document.addEventListener('click', (event) => {
    if (event.target.closest('.plus_circle_button')) {
        const product_row = event.target.closest('.product_row');
        const product_name = product_row.id.replace('product_row_', '');
        
        const item_index = items_cart.findIndex(item => item.name === product_name);
        
        if (item_index !== -1) {
            items_cart[item_index].quantity++;
            
            const n_items_p = product_row.querySelector('.n_items p');
            n_items_p.textContent = ` ${items_cart[item_index].quantity} `;
            
            const minus_button = product_row.querySelector('.minus_circle_button');
            minus_button.style.opacity = '100%';
            
            update_left_to_buy_quantity(product_name, items_cart[item_index].quantity);
        }
    }
    
    else if (event.target.closest('.minus_circle_button')) {
        const product_row = event.target.closest('.product_row');
        const product_name = product_row.id.replace('product_row_', '');
        
        const item_index = items_cart.findIndex(item => item.name === product_name);
        
        if (item_index !== -1 && items_cart[item_index].quantity > 1) {
            items_cart[item_index].quantity--;
            
            const n_items_p = product_row.querySelector('.n_items p');
            n_items_p.textContent = ` ${items_cart[item_index].quantity} `;
            
            const minus_button = product_row.querySelector('.minus_circle_button');
            if (items_cart[item_index].quantity === 1) {
                minus_button.style.opacity = '30%';
            }
            
            update_left_to_buy_quantity(product_name, items_cart[item_index].quantity);
        }
    }

    store_data();

});

function update_left_to_buy_quantity(product_name, new_quantity) {
    const left_to_buy_list = document.querySelector('.list_of_items_left');
    const item_elements = left_to_buy_list.querySelectorAll('.item_left');
    
    item_elements.forEach(item_element => {
        const item_text = item_element.querySelector('p').textContent.trim();
        if (item_text === product_name) {
            const circle_p = item_element.querySelector('.circle p');
            circle_p.textContent = new_quantity;
        }
    });
}

// For text input instead of the name
document.addEventListener('click', (event) => {
    if (event.target.matches('.product_name_wrapper p') ) {
        const product_row = event.target.closest('.product_row');
        const product_name = product_row.id.replace('product_row_', '');
        
        const status_p = product_row.querySelector('.bought_status p');
        if (status_p.textContent.trim() === 'Не куплено') {
            start_name_editing(event.target, product_name);
        }
    }

    store_data();

});

function start_name_editing(name_element, current_name) {
    const product_row = name_element.closest('.product_row');
    
    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.value = current_name;
    
    // Style the input to match the original text
    input.style.cssText = `
        border: 2px solid #2185d0;
        border-radius: 4px;
        outline: none;
        height: 1.5rem;
        padding: 15px 0 15px 5px;
        font-size: 0.9rem;
        width: 8rem;
    `;
    
    name_element.style.display = 'none';
    name_element.parentNode.appendChild(input);
    
    input.focus();
    
    function finish_editing() {
        const new_name = input.value.trim();
        
        if (new_name && new_name.length > 0 && new_name !== current_name) {
            if (!items_cart.some(item => item.name === new_name)) {
                const item_index = items_cart.findIndex(item => item.name === current_name);
                if (item_index !== -1) {
                    items_cart[item_index].name = new_name;
                    
                    product_row.id = `product_row_${new_name}`;
                    
                    name_element.textContent = new_name;
                    
                    update_left_to_buy_name(current_name, new_name);
                }
            }
        }
        
        input.remove();
        name_element.style.display = '';
    }
    
    input.addEventListener('blur', finish_editing);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            input.blur();
        } else if (event.key === 'Escape') {
            input.value = current_name;
            input.blur();
        }
    });
}

function update_left_to_buy_name(old_name, new_name) {
    const left_to_buy_list = document.querySelector('.list_of_items_left');
    const item_elements = left_to_buy_list.querySelectorAll('.item_left');
    
    item_elements.forEach(item_element => {
        const item_text = item_element.querySelector('p').textContent.trim();
        if (item_text === old_name) {
            item_element.querySelector('p').textContent = new_name;
        }
    });
}



// const product_row = cart_menu.querySelector(`#product_row_${items_cart[0].name}`);
// product_row.querySelector('.status_and_remove_menu > .bought_status').click();
