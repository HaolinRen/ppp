
from dataReader import *
import datetime

from ..graphBase import tlpGraph

EQUAL = 0
SMALLER = 1
SMALLER_EQUAL = 2
BIGGER = 3
BIGGER_EQUAL = 4
NO_EQUAL = 5

class GraphBuilder():
    def __init__(self):
        self.graph = {
            'nodes': [],
            'links': []
        }
        self.nodeIndex = {}
        self.nodeCount = 0
        self.eventIndex = {}

    def getPresentDate(self):
        return datetime.datetime.now().strftime('%Y-%m-%d')

    def buildGraph(self, req):
        rows = self.getMultiFilesData(req['data'])
        titleRow = rows[0]
        cellRist = req['format']
        rowFiltered = self.filterRows(rows[1:], cellRist)
        self.addNodesEvents(rowFiltered, titleRow, cellRist)
        self.addLinks()
        count = 0
        for oneLink in self.graph['links']:
            eventSize = len(oneLink['events'])
            oneLink['weight'] = eventSize
            oneLink['size'] = eventSize
            oneLink['id'] = count
            count += 1

        for oneNode in self.graph['nodes']:
            eventSize = len(oneNode['events'])
            oneNode['size'] = eventSize
            oneNode['num'] = eventSize

        myTlpGraph = tlpGraph(self.graph)
        myTlpGraph.createGraph()
        self.graph = myTlpGraph.applyLayout('FM^3 (OGDF)')
        fileName = str(req['data']['filesNameList'][0].split('.csv')[0])
        graphName = fileName + ' ' + self.getPresentDate() + '.json'
        self.graph['events'] = self.eventIndex
        saveGraph(self.graph, graphName)
        return graphName
    
    def addNodesEvents(self, rows, titleRow, cellRist):
        for oneRow in rows:
            nodeIndex = oneRow[cellRist['nodeIndex']]
            nodeType = titleRow[cellRist['nodeIndex']]
            nodeLabel = oneRow[cellRist['nodeLabelIndex']]
            nodeProps = {}

            eventIndex = oneRow[cellRist['eventIndex']]
            eventProps = {}
            eventType = titleRow[cellRist['eventIndex']]

            for onePropIndex in cellRist['nodeProperties']:
                nodeProps[titleRow[onePropIndex]] = oneRow[onePropIndex]

            for onePropIndex in cellRist['eventProperties']:
                eventProps[titleRow[onePropIndex]] = oneRow[onePropIndex]
            
            if cellRist['eventTime']:
                et = self.getEventTime(oneRow[cellRist['eventTime']['cellIndex']], cellRist['eventTime']['timeFormat'])
            else:
                et = 'null'

            if cellRist['isArr']:
                nodesIndexArr = nodeIndex.split(cellRist['arrDelim'])
                nodesLabelArr = nodeLabel.split(cellRist['arrDelim'])
            else:
                nodesIndexArr = [nodeIndex]
                nodesLabelArr = [nodeLabel]
            count = 0
            for oneNode in nodesIndexArr:
                while oneNode[0] == ' ':
                    oneNode = oneNode[1:]
                while oneNode[-1] == ' ':
                    oneNode = oneNode[:-1]
                nodeGraphIndex = self.addNode(oneNode, nodesLabelArr[count], nodeType, nodeProps, eventIndex)
                count += 1
                self.addEvent(eventIndex, eventProps, eventType, nodeGraphIndex, et)

    def getEventTime(self, et, kind):
        if kind == 0 or kind == 1:
            day = et[0:2]
            month = et[3:5]
            year = et[6:10]
        elif kind == 2 or kind == 3:
            day = et[3:5]
            month = et[0:2]
            year = et[6:10]
        elif kind == 4:
            day = et[0:2]
            month = et[2:4]
            year = et[4:8]
        elif kind == 5:
            month = et[0:2]
            day = et[2:4]
            year = et[4:8]
        elif kind == 6:
            year = et[0:4]
            month = et[4:6]
            day = et[6:8]
        elif kind == 7 or kind == 8:
            year = et[0:4]
            month = et[5:7]
            day = et[8:10]
        return year + month + day

    def addLinks(self):
        linksIndex = {}
        edgeCount = 0
        for oneEventIndex in self.eventIndex:
            membs = self.eventIndex[oneEventIndex]['members']
            tempSize = len(membs)
            for i in range(tempSize - 1):
                nodeSourceIndex = membs[i]
                for j in range(i+1, tempSize):
                    nodeTargetIndex = membs[j]
                    if nodeSourceIndex > nodeTargetIndex:
                        tempIndex = str(nodeTargetIndex) + '-' + str(nodeSourceIndex)
                    else:
                        tempIndex = str(nodeSourceIndex) + '-' + str(nodeTargetIndex)
                    if tempIndex not in linksIndex:
                        linksIndex[tempIndex] = edgeCount
                        self.graph['links'].append({
                            'source': nodeSourceIndex,
                            'target': nodeTargetIndex,
                            'events': [oneEventIndex],
                            })
                        edgeCount += 1
                    else:
                        self.graph['links'][linksIndex[tempIndex]]['events'].append(oneEventIndex)

    def addEvent(self, eventID, eventProps, eventType, memberIndex, eventTime):
        if eventID not in self.eventIndex:
            tempObj = {}
            tempObj['type'] = eventType
            tempObj['props'] = eventProps
            tempObj['members'] = [memberIndex]
            if eventTime != 'null':
                tempObj['date'] = eventTime
            self.eventIndex[eventID] = tempObj
        else:
            if memberIndex not in self.eventIndex[eventID]['members']:
                self.eventIndex[eventID]['members'].append(memberIndex)

    def addNode(self, nodeIndex, label, nodeType, props, event):

        if nodeIndex not in self.nodeIndex:
            self.graph['nodes'].append({
                'id': self.nodeCount,
                'label': label,
                'nodeType': nodeType,
                'props': props,
                'events': [event]
                })
            self.nodeIndex[nodeIndex] = self.nodeCount
            res = self.nodeCount
            self.nodeCount += 1
        else:
            res = self.nodeIndex[nodeIndex]
            if event not in self.graph['nodes'][res]['events']:
                self.graph['nodes'][res]['events'].append(event)

        return res
    
    def getMultiFilesData(self, para):
        filesNameList = para['filesNameList']
        res = []
        isFirst = True
        quotechar = str(para['quotechar'])
        delimiter = str(para['delimiter'])
        for oneFileName in filesNameList:
            rows = fileReader(oneFileName, delimiter ,quotechar, -1)
            if isFirst == True:
                res += rows
                isFirst = False
            else:
                res += rows[1:]
        return res

    def getData(self, para):
        fileName = para['fileName']
        quotechar = str(para['quotechar'])
        delimiter = str(para['delimiter'])
        res = fileReader(fileName, delimiter, quotechar, para['linesNum'])
        return res

    def checkOneRrestriction(self, row, restriction):
        cellVal = row[restriction['cellIndex']]
        if restriction['equal'] == EQUAL:
            if cellVal == restriction['input']:
                return True
        elif restriction['equal'] == SMALLER:
            if cellVal < restriction['input']:
                return True
        elif restriction['equal'] == SMALLER_EQUAL:
            if cellVal <= restriction['input']:
                return True
        elif restriction['equal'] == BIGGER:
            if cellVal > restriction['input']:
                return True
        elif restriction['equal'] == BIGGER_EQUAL:
            if cellVal >= restriction['input']:
                return True
        elif restriction['equal'] == NO_EQUAL:
            if cellVal != restriction['input']:
                return True
        return False

    def filterRows(self, rows, rist):
        res = []
        for oneRow in rows:
            nodeFiltered = self.checkRestriction(oneRow, rist['nodeRestris'])
            eventFiltered = self.checkRestriction(oneRow, rist['eventRestris'])
            if nodeFiltered and eventFiltered:
                res.append(oneRow)
        return res

    def checkRestriction(self, row, restrictions):
        flag = True
        for oneRst in restrictions:
            isPass = self.checkOneRrestriction(row, restrictions[oneRst])
            if not isPass:
                flag = False
                break
        return flag