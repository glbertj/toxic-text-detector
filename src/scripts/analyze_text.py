import sys
import json
import re
import os
import joblib
import nltk
import numpy as np
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
model_dir = os.path.join(project_root, 'notebook')

try:
    with open(os.path.join(model_dir, 'model_params.json'), 'r') as f:
        model_params = json.load(f)
    
    vectorizer_path = os.path.join(model_dir, 'vectorizer.joblib')
    model_path = os.path.join(model_dir, 'svc_model.joblib')
    
    vectorizer = joblib.load(vectorizer_path)
    svc_model = joblib.load(model_path)
    
    threshold = model_params['threshold']
    feature_names = model_params['feature_names']
    
except Exception as e:
    print(json.dumps({"error": f"Failed to load model: {str(e)}"}))
    sys.exit(1)

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9$@!\s]', '', text)
    words = nltk.word_tokenize(text)
    sw = set(stopwords.words('english'))
    words = [word for word in words if word not in sw]
    lemmatizer = WordNetLemmatizer()
    words = [lemmatizer.lemmatize(word) for word in words]
    return ' '.join(words)

def analyze_text(text):
    cleaned_text = preprocess_text(text)
    
    text_vec = vectorizer.transform([cleaned_text])
    
    score = svc_model.decision_function(text_vec)[0]
    
    is_toxic = score > threshold
    
    toxic_words = []
    nontoxic_words = []
    
    words = cleaned_text.split()
    present_indices = text_vec.nonzero()[1]
    
    for idx in present_indices:
        word = feature_names[idx]
        if word in words:
            tfidf_score = text_vec[0, idx]
            coefficient = svc_model.coef_[0][idx]
            impact = tfidf_score * coefficient
            
            if impact > 0:
                toxic_words.append(word)
            elif impact < 0:
                nontoxic_words.append(word)
    
    return {
        "isToxic": bool(is_toxic),
        "score": float(score),
        "toxicWords": toxic_words,
        "nontoxicWords": nontoxic_words
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No text provided"}))
        sys.exit(1)
    
    input_text = sys.argv[1]
    result = analyze_text(input_text)
    print(json.dumps(result))