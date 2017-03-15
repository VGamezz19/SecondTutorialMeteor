
//import { Todos } from '../api/listApi.js';
Todos = new Mongo.Collection('todos');
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './template-main.html';

//ROUTTING
Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    name: 'home',
    template: 'home'
});
//


//Start TEMPLATE todos
Template.todos.helpers({
    'todo': function(){
        return Todos.find({}, {sort: {createdAt: -1}});
    }
});
//End TEMPLATE todos

//Start TEMPLATE addTodo
Template.addTodo.events({
  'submit form': function(event){
    event.preventDefault();
    var todoName = $('[name="todoName"]').val();
      Todos.insert({
          name: todoName,
          completed: false,
          createdAt: new Date()
      });
      $('[name="todoName"]').val('');
    }
});
//End TEMPLATE addTodo

//Start TEMPLATE todoItem

Template.todoItem.helpers({
    'checked': function(){
        var isCompleted = this.completed;
        if(isCompleted){
            return "checked";
        } else {
            return "";
        }
    }
});

Template.todoItem.events({

  'change [type=checkbox]': function(){
    var documentId = this._id;
    var isCompleted = this.completed;
    if(isCompleted){
        Todos.update({ _id: documentId }, {$set: { completed: false }});
        console.log("Task marked as incomplete.");
    } else {
        Todos.update({ _id: documentId }, {$set: { completed: true }});
        console.log("Task marked as complete.");
    }
  },

  'keyup [name=todoItemInput]': function(event){
    /*var documentId = this._id;
    var todoItem = $('[name=todoItemInput]').val();  // jQuery
    //var todoItem = event.target.value;     // Non-jQuery
    Todos.update({ _id: documentId }, {$set: { name: todoItem }});
    console.log("Task changed to: " + todoItem);*/
    if(event.which == 13 || event.which == 27){
       $(event.target).blur();
   } else {
       var documentId = this._id;
       var todoItem = $(event.target).val();
       Todos.update({ _id: documentId }, {$set: { name: todoItem }});
   }

  },
  'click .delete-todo': function(event){

    event.preventDefault();
    var documentId = this._id;
    //confirm
    var confirm = window.confirm("Delete this task?");
    if(confirm){
        Todos.remove({ _id: documentId });
    }
  }
});
//End TEMPLATE todoItem

//Start TEMPLATE todosCount
Template.todosCount.helpers({
    'totalTodos': function(){
        return Todos.find().count();
    },
    'completedTodos': function(){
        return Todos.find({ completed: true }).count();
    }
});
//End TEMPLATE todosCount
