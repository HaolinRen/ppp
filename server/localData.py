import csv 
import sys
import json
# from searchAnalyse import searchAnalyse
# from parAna import participantAnalyse
# from crimeData import crimeData
# from reputation import repuAna
# from chaineGraph import chaineGraph
from graphBase import tlpGraph
# from fbData import fbData
# from twitterUser import twUsers
from graphFilePM import graphFilePM
from graphBuilder.builder import GraphBuilder
# from csvAnalyser.jsonToCsv import csvAnalyser
# from gmlGraph import myGmlGraph

sys.path.append('/Users/hren/Documents/myApplication/server/')

class dataProcess:
    def __init__(self):
        self.dataPath = './server/data/'

    def getData(self, path, req):
        re = ''
        if path == '/data':
            if req == 'emission':
                re = self.getEmi()
            elif req == 'chaine':
                re = self.getChaine()
            elif req == 'pays':
                re = self.getPays()
            elif req == 'gener':
                re = self.getGenre()
            elif req == 'participant':
                re = self.getParticitpant()
            elif req == 'layout':
                re = self.getLayout()
            elif req == 'metier':
                re = self.getMetier()
        elif path == '/search':
            mysa = searchAnalyse()
            req = json.loads(req)
            re = mysa.getSearch(req)
        # elif path == '/graph':
        #   mypa = participantAnalyse()
            # req = json.loads(req)
            # re = mypa.createGraph()
            # re = mypa.loadGraph()
        elif path == '/ccgraph':
            req = json.loads(req)
            cc = crimeData()
            re = cc.getGraph(req)
        elif path == '/repu':
            req = json.loads(req)
            myAna = repuAna()
            re = myAna.getData(req)
        elif path == '/chch':
            req = json.loads(req)
            reseauxCh = chaineGraph()
            re = reseauxCh.getData(req)
        elif path == '/glayout':
            req = json.loads(req)
            re = self.getGraphLayout(req)
        elif path == '/fbgraph':
            req = json.loads(req)
            fb = fbData()
            re = fb.getData(req)
        elif path == '/twuser':
            req = json.loads(req)
            tw = twUsers()
            re = tw.doIT()
        elif path == '/savegraph':
            req = json.loads(req)
            myGraphPM = graphFilePM()
            re = myGraphPM.saveGraph(req)

        # elif path == '/csvana':

        elif path == '/loadgraph':
            req = json.loads(req)
            myGraphPM = graphFilePM()
            re = myGraphPM.loadGraph(req)
        elif path == '/csvfile':
            sg = graphFilePM()
            csvList = sg.getCSVFilesNameList()
            re = sg.formatFilesNameList(csvList)
        elif path == '/builder/getexample':
            myBuilder = GraphBuilder()
            req = json.loads(req)
            re = myBuilder.getData(req)
        elif path == '/builder/create':
            req = json.loads(req)
            try:
                myBuilder = GraphBuilder()
                graphName = myBuilder.buildGraph(req)
                re = {
                    'success': True,
                    'graphName': graphName
                    }
            except Exception as inst:
                print inst
                re = 'error'
        elif path == '/loadskgraph':
            req = json.loads(req)
            myGraphPM = graphFilePM()
            re = myGraphPM.loadSankeyGraph(req)
        elif path == '/gflist':
            sg = graphFilePM()
            gfl = sg.getFilesNameList()
            re = sg.formatFilesNameList(gfl)
        elif path == '/skglist':
            sg = graphFilePM()
            gfl = sg.getSankeyFilesNameList()
            re = sg.formatFilesNameList(gfl)
        else:
            return {'code': '-1', 'message': 'empty'}
        return {'code': '0', 'message':'', 'data': re}  

    def getMetier(self):
        arr = []
        with open('./server/data/metier.csv', 'rb') as csvfile:
            spamreader = csv.reader(csvfile, delimiter='\n', quotechar='"')
            for row in spamreader:
                arr.append({'label': row[0]})
        return arr

    def getPays(self):
        arr = []
        with open('./server/data/pays.csv', 'rb') as csvfile:
            spamreader = csv.reader(csvfile, delimiter='\t', quotechar='"')
            for row in spamreader:
                arr.append({'label': row[0]})
        return arr

    def getLayout(self):
        arr = []
        with open('./server/data/layout.csv', 'rb') as csvfile:
            spamreader = csv.reader(csvfile, delimiter='\n', quotechar='"')
            for row in spamreader:
                arr.append({'label': row[0]})
        return arr

    def getEmi(self):
        arr = []
        with open('./server/data/emission.csv', 'rb') as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
            for row in spamreader:
                arr.append({'date':row[0], 'value': row[1]})
        return arr

    def getChaine(self):
        arr = []
        with open('./server/data/chaine.csv', 'rb') as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
            for row in spamreader:
                arr.append({'label': row[0], 'value': row[1]})
        return arr

    def getGenre(self):
        arr = []
        with open('./server/data/gener.csv', 'rb') as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
            for row in spamreader:
                arr.append({'label': row[0], 'value': row[1]})
        return arr

    def getParticitpant(self):
        arr = []
        with open('./server/data/participant.csv', 'rb') as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
            for row in spamreader:
                arr.append({'label': row[0], 'value': row[1]})
        return arr

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

    # def processGML(self, data):
    #   myGML = myGmlGraph()
    #   myGML.readGraph(data)

class pathProcess:
    def __init__(self):
        self.pList = ['/data', '/person', '/search', '/ccgraph', '/analyser',
                     '/twuser', '/repu', '/chch', '/glayout','/fbgraph', '/savegraph',
                    '/loadgraph', '/builder/create', '/builder/getexample', '/gflist', '/gml', '/skglist', '/loadskgraph', '/csvfile']

    def checkPath(self, path):
        return path in self.pList
