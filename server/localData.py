import csv 
import sys
import json
import os
import sys

from server.graphBase import tlpGraph

from server.graphFilePM import graphFilePM

class dataProcess:
    def __init__(self):
        self.dataPath = './server/data/'

    def getData(self, path, req):
        re = ''
        if path == '/glayout':
            req = json.loads(req)
            re = self.getGraphLayout(req)
        elif path == '/savegraph':
            req = json.loads(req)
            myGraphPM = graphFilePM()
            re = myGraphPM.saveGraph(req)
        elif path == '/loadgraph':
            req = json.loads(req)
            myGraphPM = graphFilePM()
            re = myGraphPM.loadGraph(req)
        elif path == '/gflist':
            sg = graphFilePM()
            gfl = sg.getFilesNameList()
            re = sg.formatFilesNameList(gfl)
        else:
            return {'code': '-1', 'message': 'empty'}
        return {'code': '0', 'message':'', 'data': re}  

    def readData(self, path, deli, callback):
        arr = []
        with open(path, 'rb') as csvfile:
            spamreader = csv.reader(csvfile. deli, quotechar='"')
            for row in spamreader:
                arr.append(callback(row))

    def getGraphLayout(self, data):
        graph = data['data']
        layout = data['layout']
        myGraph = tlpGraph(graph)
        myGraph.createGraph()
        return myGraph.applyLayout(layout)


class pathProcess:
    def __init__(self):
        self.pList = ['/data', '/loadgraph', '/gflist', '/glayout']

    def checkPath(self, path):
        return path in self.pList
