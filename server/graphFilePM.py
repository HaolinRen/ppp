from os import listdir
import json

class graphFilePM:
    def __init__(self):
        self.graphPath = './server/data/graph/'
        self.csvPath = './server/data/csvFile'
        self.sankeyGraphPath = './server/data/sankeyGraph/'

    def saveGraph(self, req):
        try:
            dataName = req['graphName']
            graph = req['graph']
            fileName = self.graphPath + self.testFileName(dataName)
            with open(fileName, 'w') as infile:
                json.dump(graph, infile)
            infile.close()
            return {
                    'success': True,
                    'info': ''
                }
        except:
            return {'success': False,
                    'info': 'can\'t process your request'}
            
    def loadGraph(self, req):
        try:
            graphName = req['graphName']
            if graphName not in self.getFilesNameList():
                return {'success': False, 'info': 'no this file.'}
            else:
                fileName = self.graphPath + graphName
                with open(fileName, 'rb') as outfile:
                    data = json.load(outfile)
                outfile.close()
                return {
                    'success' : True,
                    'data' : data
                }
        except:
            return {'success': False, 'info': 'no this file.'}

    def loadSankeyGraph(self, req):
        try:
            graphName = req['graphName']
            # if graphName not in self.getSankeyFilesNameList():
            #     return {'success': False, 'info': 'no this file.'}
            # else:
            fileName = self.sankeyGraphPath + graphName
            with open(fileName, 'rb') as outfile:
                data = json.load(outfile)
            outfile.close()
            return {
                'success' : True,
                'data' : data
            }
        except:
            return {'success': False, 'info': 'no this file.'}

    def testFileName(self, fileName):
        suxFix = fileName[-5:]
        fullName = ''
        if suxFix != '.json':
            fullName = fileName + '.json'
        else:
            fullName = fileName
        temp = 2
        testName = fullName
        while testName in self.getFilesNameList():
            testName = fullName.replace('.json', str(temp)+'.json', -1)
            temp += 1
        return testName

    def getFilesNameList(self):
        filesNameList = listdir(self.graphPath)
        res = []
        for fileName in filesNameList:
            suxFix = fileName[-5:]
            if suxFix == '.json':
                res.append(fileName)
        res.sort()
        return res

    def getSankeyFilesNameList(self):
        filesNameList = listdir(self.sankeyGraphPath)
        res = []
        for fileName in filesNameList:
            suxFix = fileName[-5:]
            if suxFix == '.json':
                res.append(fileName)
        res.sort()
        return res

    def getCSVFilesNameList(self):
        filesNameList = listdir(self.csvPath)
        res = []
        for fileName in filesNameList:
            suxFix = fileName[-4:]
            if suxFix == '.csv' or suxFix == '.CSV':
                res.append(fileName)
        res.sort()
        return res

    def formatFilesNameList(self, filesNameList):
        res = {}
        res['success'] = True
        res['results'] = []
        for item in filesNameList:
            temp = {}
            temp['name'] = item
            temp['value'] = item
            temp['text'] = item
            res['results'].append(temp)
        return res
