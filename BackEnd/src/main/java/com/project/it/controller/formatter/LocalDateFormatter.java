package com.project.it.controller.formatter;

import org.springframework.format.Formatter;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class LocalDateFormatter implements Formatter<LocalDate> {
    //브라우저에서 문자열로 넘어온 날짜/시간의 변환 자동화 클래스
    //config->CustomServletConfig 에 등록

    @Override
    public LocalDate parse(String text, Locale locale)  {
        return LocalDate.parse(text, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    } //**throws ParseException 삭제해야 함

    @Override
    public String print(LocalDate object, Locale locale) {
        return DateTimeFormatter.ofPattern("yyyy-MM-dd").format(object);
    }

}
