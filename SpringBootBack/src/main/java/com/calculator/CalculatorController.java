package com.calculator;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@RequestMapping("/calculate")
public class CalculatorController {

	@PostMapping("/expression")
	public String recieve(@RequestBody String exp) {
		Calculate calc =new Calculate();
		String result = "";
		try {
			result = calc.process(exp);
		} catch (RuntimeException e) {
			result = "E";
		}
		return result;
	}// end of calculate

}
