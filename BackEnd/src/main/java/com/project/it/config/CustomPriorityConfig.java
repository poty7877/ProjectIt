package com.project.it.config;

import com.project.it.constant.ProjectPriority;

import java.util.Comparator;

public class CustomPriorityConfig implements Comparator<ProjectPriority> {


    @Override
    public int compare(ProjectPriority p1, ProjectPriority p2) {
        return Integer.compare(p2.ordinal(), p1.ordinal());
    }
}
