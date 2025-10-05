from flask import Flask, jsonify, request
import networkx as nx
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
import pandas as pd
import numpy as np
import io
import base64

app = Flask(__name__)

class KnowledgeGraphVisualizer:
    """Makale verileri için bilgi grafiği görselleştirici"""
    def __init__(self):
        sns.set_style("whitegrid")
        plt.rcParams['figure.figsize'] = (12, 8)

    def create_knowledge_graph(self, concepts, relations):
        """
        Bilgi grafiği oluştur ve görselleştir
        concepts: [{'id': 'A', 'label': 'Kavram A'}, ...]
        relations: [{'source': 'A', 'target': 'B', 'type': 'bağlantı'}, ...]
        """
        G = nx.Graph()
        for concept in concepts:
            G.add_node(concept['id'], label=concept['label'])
        for rel in relations:
            G.add_edge(rel['source'], rel['target'], type=rel.get('type', 'bağlantı'))
        plt.figure(figsize=(10, 8))
        pos = nx.spring_layout(G, k=1.5, iterations=50)
        node_labels = nx.get_node_attributes(G, 'label')
        nx.draw_networkx_nodes(G, pos, node_size=800, node_color='#6366f1', alpha=0.8)
        nx.draw_networkx_edges(G, pos, width=2, edge_color='#3b82f6', alpha=0.5)
        nx.draw_networkx_labels(G, pos, labels=node_labels, font_size=12, font_weight='bold', font_color='white')
        plt.title('Bilgi Grafiği', fontsize=16, fontweight='bold')
        plt.axis('off')
        plt.tight_layout()
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode()
        plt.close()
        return {'image': image_base64, 'node_count': G.number_of_nodes(), 'edge_count': G.number_of_edges()}

visualizer = KnowledgeGraphVisualizer()

@app.route('/api/visualize/knowledge-graph', methods=['POST'])
def knowledge_graph():
    """Bilgi grafiği görselleştirme endpointi"""
    data = request.json
    concepts = data.get('concepts', [])
    relations = data.get('relations', [])
    result = visualizer.create_knowledge_graph(concepts, relations)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5004)
