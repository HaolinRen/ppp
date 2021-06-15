import csv
import json
import os.path

DATA_PATH =  './server/data/csvFile/'
GRAPH_PATH = './server/data/graph/'


def fileReader(fileName, delimiter, quotechar, lineNum):
	count = 0
	res = []
	with open(DATA_PATH + fileName, 'r') as csvfile:
		spamreader = csv.reader(csvfile, delimiter=delimiter, quotechar=quotechar)
		for row in spamreader:
			if lineNum > 0 and count > lineNum:
				break
			res.append(row)
			count += 1
	return res


def fileWriter(fileName, rows):
	with open(fileName, 'w') as csvfile:
		spamwriter = csv.writer(csvfile, delimiter=';',
								quotechar='"', quoting=csv.QUOTE_MINIMAL)
		for onerow in rows:
			spamwriter.writerow(onerow)


def saveGraph(data, graphName):
	with open(GRAPH_PATH + graphName, 'w') as outfile:
		json.dump(data, outfile)
	outfile.close()

def reduceGraph():

	tempGraph = {
		'nodes': [],
		'links': []
	}

	checker = {}
	k = 0
	with open('/Users/hren/Workspace/SUSTC/nonLocalGraph.json', 'r') as graphfile:
		g = json.load(graphfile)
		
		for node in g['nodes']:
			tempGraph['nodes'].append(node)
			checker[k] = 0
			k += 1
			if len(tempGraph['nodes']) > 1000:
				break
		for link in g['links']:
			if link['source'] in checker and link['target'] in checker:
				tempGraph['links'].append(link)

			if len(tempGraph['links']) > 10000:
				break
	saveGraph(tempGraph, 'smallgraph.json')

# lines = fileReader('.././data/csvFile/participantV5.csv', ';', '"', 100)
# print(lines[0])

# fileWriter('.././data/csvFile/participantsimple.csv', lines)

# fileReader('./data/patched_0.6light_all_document.csv', 100) # 2493361 lines
# fileReader('./data/patched_0.6light_event_document.csv', '') # 829579 lines

# reduceGraph()