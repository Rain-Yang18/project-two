from flask import Flask, render_template, redirect, jsonify
from flask import Response,json
# from flask_pymongo import PyMongo
# import scrape_mars

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


# from flask import Flask, jsonify

#################################################
# Database Setup
#################################################

engine_path = ("postgresql://hqbkvuzhrlymzx:c08cc2098824445764cd8413ee9d5f79d029847ac2c6cf949ce50d490de2df3d@ec2-3-214-136-47.compute-1.amazonaws.com:5432/d3itds64i4rb7k")

engine = create_engine(engine_path)


# Reflect an existing database into a new model
Base = automap_base()

# Reflect the tables
Base.prepare(engine, reflect=True)

# # Save references to each table
forbes = engine.execute('select * from forbes_billionaires').fetchall()


new = []
for i in forbes:
    a = {"id":i[0],"name":i[1],"networth":str(i[2]),"country":i[3],"source":i[4],"rank":i[5],"age":i[6],"residence":i[7],"citizenship":i[8],"status":i[9],"children":i[10],"education":i[11],"self_made":i[12],"degree":i[13],"university":i[14], "longitude":i[15], "latitude":i[16], "groupednetworth":i[17], "fullname":i[18]}
    new.append(a)


# create an instance of Flask
app = Flask(__name__)


# route to render index.html template using data from Mongo
@app.route("/")
def home():

    return render_template("index.html")


# route to trigger the scrape function
@app.route("/test", methods=["GET"])
def scrape():

    return (jsonify(new))


if __name__ == "__main__":
    app.run(debug=True)