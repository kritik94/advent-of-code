package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
)

func two() {
	fmt.Println("hello")
}

type valve struct {
	name string
	rate int
	next []string
}

func parse(path string) []valve {
	path, err := filepath.Abs(path)
	if err != nil {
		fmt.Println(err)
		return []valve{}
	}
	fmt.Println(path)

	f, err := os.OpenFile(path, os.O_RDONLY, os.ModePerm)
	if err != nil {
		fmt.Println(err)
		return []valve{}
	}
	defer f.Close()

	re := regexp.MustCompile(`(?m)Valve (\w+).+rate=(\d+).+valves? ([A-Z, ]+)`)
	sc := bufio.NewScanner(f)

	valves := make([]valve, 0)

	var line []byte
	var matches [][]byte
	var v valve
	for sc.Scan() {
		line = sc.Bytes()
		matches = re.FindSubmatch(line)

		rate, err := strconv.Atoi(string(matches[2]))
		if err != nil {
			fmt.Println(err)
			return []valve{}
		}

		v = valve{
			name: string(matches[1]),
			rate: rate,
			next: strings.Split(string(matches[3]), ", "),
		}

		valves = append(valves, v)
	}

	return valves
}

func calcPath(valveMap map[string]valve, from, to string) int {
	if from == to {
		return 0
	}

	queue := []string{from}
	distance := make(map[string]int)
	for k := range valveMap {
		distance[k] = -1
	}
	distance[from] = 0

	var current string
	for {
		current = queue[0]
		queue = queue[1:]

		for _, next := range valveMap[current].next {
			if distance[next] > -1 {
				continue
			}

			distance[next] = distance[current] + 1
			queue = append(queue, next)

			if next == to {
				return distance[to]
			}
		}
	}
}

type move struct {
	who     string
	current string
	time    int
}

func exclude(ss []string, excl string) []string {
	for i, s := range ss {
		if s == excl {
			newS := make([]string, len(ss[:i]))
			copy(newS, ss[:i])
			return append(newS, ss[i+1:]...)
		}
	}

	return ss
}

func iter(valveMap map[string]valve, opened []string, path []move) [][]move {
	if len(opened) == 0 {
		return [][]move{path}
	}

	var lstH, lstE, lst move
	for _, m := range path {
		if m.who == "H" && (lstH.who == "" || lstH.time < m.time) {
			lstH = m
		}
		if m.who == "E" && (lstE.who == "" || lstE.time < m.time) {
			lstE = m
		}
	}

	if lstH.time < lstE.time {
		lst = lstH
	} else {
		lst = lstE
	}

	res := make([][]move, 0)
	var cost int
	for _, o := range opened {
		cost = calcPath(valveMap, lst.current, o) + 1

		if lst.time+cost > 26 {
			continue
		}

		newPath := make([]move, len(path))
		copy(newPath, path)

		res = append(
			res,
			iter(
				valveMap,
				exclude(opened, o),
				append(newPath, move{who: lst.who, current: o, time: lst.time + cost}),
			)...,
		)
	}

	return res
}

func main() {
	valves := parse("./resources/2022/day16.csv")
	valveMap := make(map[string]valve)

	opened := make([]string, 0)
	for _, v := range valves {
		valveMap[v.name] = v
		if v.rate > 0 {
			opened = append(opened, v.name)
		}
	}

	// fmt.Printf("%+v\n", valves)

	res := iter(valveMap, opened, []move{
		{who: "H", current: "AA", time: 0},
		{who: "E", current: "AA", time: 0},
	})

	var max, maxI, sum int
	for i, path := range res {
		sum = 0
		for _, v := range path {
			sum += valveMap[v.current].rate * (26 - v.time)
		}

		if sum > max {
			max = sum
			maxI = i
		}
	}

	fmt.Println(max)
	// fmt.Printf("%+v\n", res[maxI])
	fmt.Println(res[maxI])
}
