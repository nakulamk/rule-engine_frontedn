// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

const App = () => {
  const [rule, setRule] = useState('');
  const [ruleId, setRuleId] = useState('');
  const [combinedRules, setCombinedRules] = useState('');
  const [operator, setOperator] = useState('AND');
  const [combinedAst, setCombinedAst] = useState(null);
  const [data, setData] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [newRuleId, setNewRuleId] = useState('');

  // API call to create a rule
  const createRule = async () => {
    try {
      const response = await axios.post('http://localhost:5000/create_rule', {
        rule: rule,
        rule_id: ruleId,
      });
      alert('Rule Created Successfully');
    } catch (error) {
      alert('Error creating rule: ' + (error.response?.data.error || 'Unknown error'));
    }
  };
  

  // API call to combine rules
  const combineRule = async () => {
    try {
      const response = await axios.post('http://localhost:5000/combine_rules', {
        rule_ids: combinedRules.split(',').map((r) => r.trim()),
        operator: operator,
        new_rule_id: newRuleId,
      });

      setCombinedAst(response.data.ast); // Corrected to access the right response property
      alert('Rules Combined Successfully');
    } catch (error) {
      alert('Error combining rules: ' + (error.response?.data.error || 'Unknown error'));
    }
  };

  // API call to evaluate rule
  const evaluateRule = async () => {
    try {
      const response = await axios.post('http://localhost:5000/evaluate_rule', {
        rule_id: ruleId,
        data: data,
      });
      setEvaluationResult(response.data.result);
    } catch (error) {
      alert('Error evaluating rule: ' + (error.response?.data.error || 'Unknown error'));
    }
  };

  // Handling dynamic input for user data attributes
  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="App">
      <h1>Rule Engine</h1>

      {/* Create Rule */}
      <div className="section">
        <h2>Create Rule</h2>
        <input
          type="text"
          placeholder="Enter Rule (e.g., age > 30 AND department = 'Sales')"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Rule ID (e.g., rule1)"
          value={ruleId}
          onChange={(e) => setRuleId(e.target.value)}
        />
        <button onClick={createRule}>Create Rule</button>
      </div>

      {/* Combine Rules */}
      <div className="section">
        <h2>Combine Rules</h2>
        <input
          type="text"
          placeholder="Enter Rule IDs to combine (e.g., rule1, rule2)"
          value={combinedRules}
          onChange={(e) => setCombinedRules(e.target.value)}
        />
        <select value={operator} onChange={(e) => setOperator(e.target.value)}>
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <input
          type="text"
          placeholder="Enter New Rule ID for combined rule (e.g., combined_rule)"
          value={newRuleId}
          onChange={(e) => setNewRuleId(e.target.value)}
        />
        <button onClick={combineRule}>Combine Rules</button>

        {combinedAst && (
          <div className="result">
            <h3>Combined AST</h3>
            <pre>{JSON.stringify(combinedAst, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Evaluate Rule */}
      <div className="section">
        <h2>Evaluate Rule</h2>
        <input
          type="text"
          placeholder="Enter Rule ID for evaluation (e.g., rule1)"
          value={ruleId}
          onChange={(e) => setRuleId(e.target.value)}
        />
        <div className="data-inputs">
          <input
            type="number"
            name="age"
            placeholder="Age"
            onChange={handleDataChange}
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            onChange={handleDataChange}
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            onChange={handleDataChange}
          />
          <input
            type="number"
            name="experience"
            placeholder="Experience"
            onChange={handleDataChange}
          />
        </div>
        <button onClick={evaluateRule}>Evaluate Rule</button>

        {evaluationResult !== null && (
          <div className="result">
            <h3>Evaluation Result: {evaluationResult ? 'True' : 'False'}</h3>
          </div>
        )}
      </div>

      <footer>
        <p>
          Developed by <a href="#">Your Name</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
