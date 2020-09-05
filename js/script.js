'use strict';


class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form)
        this.input = document.querySelector(input)
        this.todoList = document.querySelector(todoList)
        this.todoCompleted = document.querySelector(todoCompleted)
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));

    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]))
    }

    render() {
        this.todoList.textContent = ''
        this.todoCompleted.textContent = ''
        this.todoData.forEach(this.createItem, this)
        this.addToStorage()
    }

    createItem(todo) {
        const li = document.createElement('li')
        li.classList.add('todo-item')
        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
        <div class="todo-buttons">
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
        </div>
        `)

        if (todo.completed) {
            this.todoCompleted.append(li)
        } else this.todoList.append(li)
    }


    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newToDo = {
                value: this.input.value,
                completed: true,
                key: this.generateKey()
            }
            this.todoData.set(newToDo.key, newToDo)
            this.render()
        } else alert('Пустое дело добавлять нельзя')


    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    deleteItem(target) {
        console.log(this.todoData);
        // target.closest('.todo-item').remove()
    //    по ключу найти элемент и удалить его из Мап
    }

    completedItem() {
    //    перебрать тодуДата, и найти элемент который мы нажали и изменить с тру на фолс или наоборот
    }

    handler() {
    //    делегирование
        this.todoList.addEventListener('click', (event) => {

            let target = event.target
            console.log(target)
            if (target.matches('.todo-remove')) {
                this.deleteItem(target)
            }
        })
    }


    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this))
        this.handler()
        this.render()

    }

}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed')

todo.init()
