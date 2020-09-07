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
        li.setAttribute('data-key', `${todo.key}`)
        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
        <div class="todo-buttons">
        <button class="todo-edit"></button>
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
                completed: false,
                key: this.generateKey()
            }
            this.todoData.set(newToDo.key, newToDo)
            this.render()
            this.input.value = ''
        } else alert('Пустое дело добавлять нельзя')


    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
    animationToDo(target) {
        let count = 1
        const anim = () => {
            count -= 0.2
            target.closest('.todo-item').style.opacity = `${count}`

            if (count > 0) {
                setTimeout(anim, 100)
            }
        }
        anim()

    }

    deleteItem(target) {
        this.todoData.delete(`${target.closest('.todo-item').getAttribute('data-key')}`)
        this.addToStorage()
        this.animationToDo(target)
        setTimeout(() => {
            target.closest('.todo-item').remove()
        }, 500)


        //    по ключу найти элемент и удалить его из Мап
    }

    completedItem(target) {
        let todo = this.todoData.get(`${target.closest('.todo-item').getAttribute('data-key')}`)
        this.todoData.forEach(item => {
            if (item.key === todo.key) {
                    item.completed = item.completed === false;
            }
        })
        this.render()
        //    перебрать тодуДата, и найти элемент который мы нажали и изменить с тру на фолс или наоборот
    }
    edit(target) {
        target.closest('.todo-item').setAttribute('contenteditable', true)
        let toDo = this.todoData.get(`${target.closest('.todo-item').getAttribute('data-key')}`)
        target.closest('.todo-item').addEventListener('focusout', () => {
                    let value = this.todoData.get(toDo.key)
                    value = {...value, value: target.closest('.todo-item').innerText}
                    this.todoData.set(toDo.key, value)
                    this.addToStorage()
        })

    }
    delegation(event) {
        let target = event.target
        if (target.matches('.todo-remove')) {
            this.deleteItem(target)
        } if (target.matches('.todo-complete')) {
            this.animationToDo(target)
            setTimeout(() => {
                this.completedItem(target)
            }, 500)

        } if (target.matches('.todo-edit')) {
            this.edit(target)
        }
    }

    handler() {
    //    делегирование
        this.todoList.addEventListener('click', (event) => {
            this.delegation(event)
        })
        this.todoCompleted.addEventListener('click', (event) => {
            this.delegation(event)
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
