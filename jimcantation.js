/**
 * Compute a student's grade. Transcribed from the COMP 3403 course overview,
 * fall 2014. Should be identical across COMP 2103/3403/3713.
 *
 * All numeric parameters should be percentages in the range 0-100 inclusive.
 * See a course outline for an explanation of the purpose of the JB flag;
 * behaviourally, when set, it adds an additional 3% to the final mark.
 *
 * @param {number} e the exam mark
 * @param {number} m the midterm mark
 * @param {number} a the assignment mark
 * @param {number} b bonus mark, if any
 * @param {boolean} jb the JB flag
 */
var grade = function(e, m, a, b, jb)
{
    var f = 0.5 * e + 0.1 * m + 0.1 * a + b + ((jb) ? 3 : 0);

    if (e < 40)
        f += 0.3 * e;
    else
        if (e > 50)
            f += 0.2 * Math.max(e, m) + 0.1 * Math.max(e, a);
        else
            f += 0.02 * ((e - 40) * Math.max(e, m) + (50 - e) * e)
               + 0.01 * ((e - 40) * Math.max(e, a) + (50 - e) * e);

    if (m < 40)
        f = Math.min(f, m);

    if (a < 50)
        f = Math.min(f, a);

    return f;
}

/**
 * Retrieve a mark from the given text input element.
 *
 * @param {string} the ID of a text input element
 * @return {number} a numeric value from that element, bounded by [0, 100]
 */
var retrieveMark = function(id)
{
    var mark = $(id).val();
    if (mark === '')
        mark = 0;
    return Math.max(0, Math.min(100, mark));
}

/**
 * Pull in marks from the three input elements on the page and update the graph.
 */
var graph = function()
{
    var assignment_mark = retrieveMark('#assignment-mark');
    var midterm_mark = retrieveMark('#midterm-mark');
    var bonus_mark = retrieveMark('#bonus-mark');

    var grades = [];
    for (var exam_mark = 1; exam_mark <= 100; exam_mark++)
    {
        var final_mark = grade(exam_mark, midterm_mark, assignment_mark, bonus_mark, false);
        grades.push({
            'exam': exam_mark,
            'grade': final_mark
        });
    }

    /* Create or update the graph. */
    data_graphic({
        title: 'Course Grades based on Exam Mark',
        data: grades,
        min_x: 0,
        max_x: 100,
        min_y: 0,
        max_y: 100,
        baselines: [
            {value: 50, 'label': 'D-'},
            {value: 60, 'label': 'C-'}
        ],
        width: 600,
        height: 400,
        target: '#graph',
        x_accessor: 'exam',
        x_label: 'Exam mark',
        y_accessor: 'grade',
        y_label: 'Final mark',
        interpolate: 'monotone'
    });

    /* If this is the first time showing the graph, we'll need to unhide it. */
    $('#graph').slideDown();
}

$(document).ready(function() {
    /* Just for fun, randomize the mark placeholder values. */
    $('#assignment-mark').attr('placeholder', Math.floor(Math.random() * 30 + 65));
    $('#midterm-mark').attr('placeholder', Math.floor(Math.random() * 45 + 40));

    $('#graph').hide();

    $('.mark').keyup(function() {
        graph();
    });
});