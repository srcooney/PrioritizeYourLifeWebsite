import webapp2
import urllib2
import os
import jinja2
import json
import logging

from google.appengine.ext import ndb

from google.appengine.api import users

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class LoginPage(webapp2.RequestHandler):         
    def get(self):
        user = users.get_current_user()

        if user:
            self.redirect("/")
        else:
            self.redirect(users.create_login_url(self.request.uri))

class Milestone(ndb.Model):
    title = ndb.StringProperty()
    completed = ndb.BooleanProperty() 
    updates = ndb.StringProperty(repeated=True)

    
class Goal(ndb.Model):
    title = ndb.StringProperty()
    completed = ndb.BooleanProperty() 
    milestones = ndb.LocalStructuredProperty(Milestone, repeated=True)
    
class Priority(ndb.Model):
    title = ndb.StringProperty()
    goals = ndb.LocalStructuredProperty(Goal, repeated=True)
    
class Owner(ndb.Model):
    username = ndb.StringProperty()
    priorities = ndb.LocalStructuredProperty(Priority, repeated=True)
   
class SaveAll(webapp2.RequestHandler):         
    def get(self):
        user = users.get_current_user().nickname()
        owners = Owner.query()
        for owner in owners:
            if owner.username == user:
                break
        Stype = self.request.get('type')
        priorityTitle = self.request.get('priority')
        goalTitle = self.request.get('goal')
        milestoneTitle = self.request.get('milestone')
        update = self.request.get('update')
        goalCheckbox = self.request.get('goalCheckbox')
        milestoneCheckbox = self.request.get('milestoneCheckbox')
        logging.info(Stype+priorityTitle+goalTitle+milestoneTitle+"11111111111111111111111111")
        if(priorityTitle != "" and Stype != "priority"):
            priorityObj = next((i for i in owner.priorities if i.title == priorityTitle), None)
            priorityIndex = owner.priorities.index(priorityObj)
        if(goalTitle != "" and Stype != "goal"):
            goalObj = next((i for i in owner.priorities[priorityIndex].goals if i.title == goalTitle), None)
            goalIndex = owner.priorities[priorityIndex].goals.index(goalObj)
        if(milestoneTitle != "" and Stype != "milestone"):
            milestoneObj = next((i for i in owner.priorities[priorityIndex].goals[goalIndex].milestones if i.title == milestoneTitle), None)
            milestoneIndex = owner.priorities[priorityIndex].goals[goalIndex].milestones.index(milestoneObj)
        
        if(Stype == "priority"):
            priority = Priority(title=priorityTitle)
            owner.priorities.append(priority)
        elif(Stype == "goal"):
            goal = Goal(title=goalTitle)
            owner.priorities[priorityIndex].goals.append(goal)
        elif(Stype == "milestone"):
            milestone = Milestone(title=milestoneTitle)
            owner.priorities[priorityIndex].goals[goalIndex].milestones.append(milestone)
        elif(Stype == "update"):
            owner.priorities[priorityIndex].goals[goalIndex].milestones[milestoneIndex].updates.append(update)
        elif(Stype == "goal_checkbox"):
            owner.priorities[priorityIndex].goals[goalIndex].completed = goalCheckbox == "true"
        elif(Stype == "milestone_checkbox"):
            owner.priorities[priorityIndex].goals[goalIndex].milestones[milestoneIndex].completed = milestoneCheckbox == "true"
        logging.info(goalCheckbox + "------------------------------------------")       
        owner.put()
        
class DeleteAny(webapp2.RequestHandler):         
    def get(self):
        user = users.get_current_user().nickname()
        owners = Owner.query()
        for owner in owners:
            if owner.username == user:
                break
        Stype = self.request.get('type')
        title = self.request.get('title')
        logging.info(Stype + title) 
        for priority in owner.priorities:
            if(Stype == "priority" ):
                if(priority.title == title):
                    owner.priorities.remove(priority)
                    owner.put()
                    return
            else:
                for goal in priority.goals:
                    if(Stype == "goal"):
                        if(goal.title == title):
                            priorityIndex = owner.priorities.index(priority)
                            owner.priorities[priorityIndex].goals.remove(goal)
                            owner.put()
                            return
                    else:
                        for milestone in goal.milestones:
                            if(Stype == "milestone"):
                                if(milestone.title == title):
                                    priorityIndex = owner.priorities.index(priority)
                                    goalIndex = owner.priorities[priorityIndex].goals.index(goal)
                                    owner.priorities[priorityIndex].goals[goalIndex].milestones.remove(milestone)
                                    owner.put()
                                    return
                            else:
                                for update in milestone.updates:
                                    if(update == title):
                                        priorityIndex = owner.priorities.index(priority)
                                        goalIndex = owner.priorities[priorityIndex].goals.index(goal)
                                        milestoneIndex = owner.priorities[priorityIndex].goals[goalIndex].milestones.index(milestone)
                                        owner.priorities[priorityIndex].goals[goalIndex].milestones[milestoneIndex].updates.remove(update)
                                        owner.put()
                                        return

class SaveOwner(webapp2.RequestHandler):         
    def get(self):
        user = users.get_current_user().nickname()
        owners = Owner.query()
        for owner in owners:
            if owner.username == user:
                return
        newOwner = Owner(username=user)
        newOwner.put()
        
class GetSavedOwner(webapp2.RequestHandler):         
    def get(self):
        user = users.get_current_user().nickname()
        owners = Owner.query()
        for owner in owners:
            if owner.username == user:
                break
        
                
#         recipes_query = Recipe.query(ancestor=recipe_key(ALL_RECIPES_NAME)).order(-Recipe.date)
#         recipes = recipes_query.fetch(1000)
#         recipeList = []
#         for recipe in recipes:
#             if recipe.owner == users.get_current_user().email():
#                 recipeList.append(recipe.to_dict())
#         self.response.out.write(simplejson.dumps([p.to_dict() for p in photos]))
        jsonObj = json.dumps({"owner":owner.to_dict()}) 
        
        logging.info("hello") 
        logging.info(jsonObj) 
        print jsonObj
        self.response.headers.add_header('content-type', 'application/json', charset='utf-8')
        self.response.out.write(jsonObj)
        
class GoalWebsite(webapp2.RequestHandler):         
    def get(self):
        user = users.get_current_user()
        if not user:
            self.redirect("/LoginPage")
            return
        template = JINJA_ENVIRONMENT.get_template('GoalWebsite.html')
        self.response.write(template.render())
        
        
application = webapp2.WSGIApplication([
    ('/', GoalWebsite),
    ('/LoginPage', LoginPage),
    ('/SaveAll', SaveAll),
    ('/SaveOwner', SaveOwner),
    ('/GetSavedOwner', GetSavedOwner),
    ('/DeleteAny', DeleteAny),
], debug=True)