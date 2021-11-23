package com.calculator;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;
import javax.script.ScriptEngineManager;
import javax.script.ScriptEngine;
import javax.script.ScriptException;


public class Calculate {
	public String process(String exp) {
		String operators = "+-*^/%";
		Stack<Character> opStack = new Stack<Character>();
		Stack<Double> numStack = new Stack<Double>();
		String result = "";

		for (int i = 0; i < exp.length(); i++) {
			if (Character.isDigit(exp.charAt(i))
					|| (exp.charAt(i)=='-' && (i==0 || (i>0 && operators.indexOf(exp.charAt(i-1)) != -1 )))) {
				int j = i;
				if(exp.charAt(i)=='-') j++;
				while (j < exp.length() && (Character.isDigit(exp.charAt(j)) || exp.charAt(j) == '.'))
					j++;

				// if j increased then we started reading a number
				String temp = exp.substring(i, j);
				i = j - 1;
				numStack.push(Double.parseDouble(temp));
			}

			// if it is an operator
			else if (operators.indexOf(exp.charAt(i)) != -1) {
				while (!opStack.isEmpty() && getPrecedence(exp.charAt(i)) <= getPrecedence(opStack.peek())) {
					char op = opStack.pop();
					double a = numStack.pop();

					// first we check the single operand operator
					// Brackets are not operators but the only case they are used
					// to denote that the number has switched its signs

					if (op == '%') {
						// if it is percentage
						a = a / (double) 100;
						numStack.push(a);
					} else {
						double b;
						 b = numStack.pop();
						double r = miniCalculation(op, b, a);
						numStack.push(r);
					}
				}
				opStack.push(exp.charAt(i));

			} else {

				throw new RuntimeException();
			}

		}

		while (!opStack.isEmpty()) {
			char op = opStack.pop();
			double a = numStack.pop();

			// first we check the single operand operator
			// Brackets are not operators but the only case they are used
			// to denote that the number has switched its signs

			if (op == '%') {
				// if it is percentage
				a = a / (double) 100;
				numStack.push(a);
			} else {
				double b = numStack.pop();
				double r = miniCalculation(op, b, a);
				numStack.push(r);
			}
		}
		result = "" + numStack.pop();
		return result;

	}

	public int getPrecedence(char op) {
		if (op == '+' || op == '-')
			return 1;
		else if (op == '*' || op == '/')
			return 2;
		else if (op == '^')
			return 3;
		else if (op == '%')
			return 4;
		else
			throw new RuntimeException();
	}

	public double miniCalculation(char op, double x, double y) {
		switch (op) {
		case '+':
			return x + y;
		case '/':
			if (y == 0)
				throw new RuntimeException();
			else
				return x / y;
		case '*':
			return x * y;
		case '-':
			return x - y;
		case '^':
			return Math.pow(x, y);
		default:
			throw new RuntimeException();
		}
	}

}
