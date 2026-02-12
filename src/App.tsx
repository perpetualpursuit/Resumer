import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import jsPDF from 'jspdf'
import './App.css'

type Experience = {
  role: string
  company: string
  location: string
  start: string
  end: string
  summary: string
  highlights: string[]
}

type Education = {
  school: string
  degree: string
  start: string
  end: string
  details: string
}

type Project = {
  name: string
  link: string
  tech: string
  description: string
}

type Personal = {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
}

type ResumeData = {
  personal: Personal
  summary: string
  experiences: Experience[]
  education: Education[]
  projects: Project[]
  skills: string[]
}

const blankExperience: Experience = {
  role: '',
  company: '',
  location: '',
  start: '',
  end: '',
  summary: '',
  highlights: [''],
}

const blankEducation: Education = {
  school: '',
  degree: '',
  start: '',
  end: '',
  details: '',
}

const blankProject: Project = {
  name: '',
  link: '',
  tech: '',
  description: '',
}

const sampleData: ResumeData = {
  personal: {
    fullName: 'Avery Morgan',
    title: 'Senior Product Engineer',
    email: 'avery.morgan@email.com',
    phone: '+1 (415) 555-3124',
    location: 'San Francisco, CA',
    website: 'averymorgan.dev',
    linkedin: 'linkedin.com/in/averymorgan',
  },
  summary:
    'Product-minded engineer with 8+ years building delightful, reliable web experiences across fintech and productivity. Comfortable leading ambiguous initiatives, partnering with design, and shipping fast with quality.',
  experiences: [
    {
      role: 'Lead Frontend Engineer',
      company: 'Northline Labs',
      location: 'Remote',
      start: '2022',
      end: 'Present',
      summary:
        'Own web experience for AI-enabled research suite; lead 5 engineers and partner with PM/Design.',
      highlights: [
        'Redesigned onboarding, improving activation by 22% MoM.',
        'Built PDF export pipeline with templating and versioning; reduced support tickets by 40%.',
        'Introduced accessibility playbook; WCAG AA compliance for core flows.',
      ],
    },
    {
      role: 'Senior Software Engineer',
      company: 'Harbor Financial',
      location: 'Hybrid',
      start: '2019',
      end: '2022',
      summary: 'Shipped investor dashboards and reporting tools across web and mobile.',
      highlights: [
        'Implemented design system in React/TypeScript; cut new feature build time by 35%.',
        'Led performance workstream; reduced bundle size by 28% and improved LCP by 600ms.',
      ],
    },
  ],
  education: [
    {
      school: 'University of Washington',
      degree: 'B.S. Computer Science',
      start: '2013',
      end: '2017',
      details: 'Human-computer interaction focus; ACM chapter lead.',
    },
  ],
  projects: [
    {
      name: 'Sprintboard',
      link: 'github.com/avery/sprintboard',
      tech: 'React, Zustand, Vite, D3',
      description: 'Agile dashboard with story mapping, velocity charts, and PDF reporting.',
    },
    {
      name: 'Glacier',
      link: 'glacier.app',
      tech: 'Next.js, Prisma, Tailwind, AWS',
      description: 'Data room builder with granular permissions and secure audit trails.',
    },
  ],
  skills: [
    'TypeScript',
    'React',
    'Node.js',
    'GraphQL',
    'Design systems',
    'Testing (Vitest, Playwright)',
    'Accessibility',
  ],
}

function App() {
  const [data, setData] = useState<ResumeData>(sampleData)

  const skillsInput = useMemo(() => data.skills.join(', '), [data.skills])

  const setPersonal = (field: keyof Personal, value: string) => {
    setData((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }))
  }

  const setExperienceField = (
    index: number,
    field: keyof Experience,
    value: string | string[],
  ) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp,
      ),
    }))
  }

  const setEducationField = (index: number, field: keyof Education, value: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))
  }

  const setProjectField = (index: number, field: keyof Project, value: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) => (i === index ? { ...proj, [field]: value } : proj)),
    }))
  }

  const addExperience = () => setData((prev) => ({ ...prev, experiences: [...prev.experiences, { ...blankExperience }] }))
  const removeExperience = (index: number) =>
    setData((prev) => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }))

  const addEducation = () => setData((prev) => ({ ...prev, education: [...prev.education, { ...blankEducation }] }))
  const removeEducation = (index: number) =>
    setData((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }))

  const addProject = () => setData((prev) => ({ ...prev, projects: [...prev.projects, { ...blankProject }] }))
  const removeProject = (index: number) =>
    setData((prev) => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }))

  const updateHighlight = (expIndex: number, highlightIndex: number, value: string) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => {
        if (i !== expIndex) return exp
        const highlights = exp.highlights.map((h, hi) => (hi === highlightIndex ? value : h))
        return { ...exp, highlights }
      }),
    }))
  }

  const addHighlight = (expIndex: number) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === expIndex ? { ...exp, highlights: [...exp.highlights, ''] } : exp,
      ),
    }))
  }

  const removeHighlight = (expIndex: number, highlightIndex: number) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => {
        if (i !== expIndex) return exp
        return {
          ...exp,
          highlights: exp.highlights.filter((_, hi) => hi !== highlightIndex),
        }
      }),
    }))
  }

  const handleSkillsChange = (value: string) => {
    const skills = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    setData((prev) => ({ ...prev, skills }))
  }

  const resetData = () => setData(sampleData)
  const clearData = () =>
    setData({
      personal: { fullName: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '' },
      summary: '',
      experiences: [{ ...blankExperience }],
      education: [{ ...blankEducation }],
      projects: [{ ...blankProject }],
      skills: [],
    })

  const exportPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' })
    const margin = 56
    const pageWidth = doc.internal.pageSize.getWidth()
    const usableWidth = pageWidth - margin * 2
    const pageHeight = doc.internal.pageSize.getHeight()

    const colors = {
      ink: [20, 20, 20] as [number, number, number],
      sub: [60, 60, 60] as [number, number, number],
      meta: [105, 105, 105] as [number, number, number],
      line: [200, 200, 200] as [number, number, number],
      link: [30, 90, 200] as [number, number, number],
    }

    let y = margin
    const line = (height = 16) => {
      y += height
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
    }

    const divider = () => {
      doc.setDrawColor(...colors.line)
      doc.setLineWidth(0.6)
      doc.line(margin, y, pageWidth - margin, y)
      line(12)
    }

    const headerLine = [data.personal.title, [data.personal.email, data.personal.phone].filter(Boolean).join(' | ')]
      .filter(Boolean)
      .join(' | ')
    const links = [data.personal.website, data.personal.linkedin].filter(Boolean).join(' | ')

    const headerBoxTop = y - 2
    const headerPad = 6
    y = headerBoxTop + headerPad + 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(...colors.ink)
    doc.text(data.personal.fullName || 'Your Name', margin, y)
    doc.setFontSize(11.5)
    doc.setFont('helvetica', 'normal')
    line(18)
    if (headerLine) {
      doc.setTextColor(...colors.sub)
      doc.text(doc.splitTextToSize(headerLine, usableWidth), margin, y)
      line(14)
    }
    if (links) {
      doc.setTextColor(...colors.link)
      doc.text(doc.splitTextToSize(links, usableWidth), margin, y)
      line(14)
    }
    y += headerPad
    divider()

    const writeSectionTitle = (title: string) => {
      doc.setTextColor(...colors.sub)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      const label = title.toUpperCase()
      doc.text(label, margin, y)
      doc.setDrawColor(...colors.line)
      doc.setLineWidth(0.9)
      doc.line(margin, y + 6, pageWidth - margin, y + 6)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      line(18)
    }

    const writeParagraph = (text: string) => {
      const lines = doc.splitTextToSize(text, usableWidth)
      doc.text(lines, margin, y)
      line(lines.length * 14)
    }

    const writeItemHeader = (title: string, meta?: string) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(...colors.ink)
      doc.text(title, margin, y)
      if (meta) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10.5)
        doc.setTextColor(...colors.meta)
        doc.text(meta, pageWidth - margin, y, { align: 'right' })
      }
      doc.setFontSize(11)
      doc.setTextColor(...colors.sub)
      line(14)
    }

    const writeBullet = (text: string) => {
      const indent = 14
      const lines = doc.splitTextToSize(text, usableWidth - indent)
      lines.forEach((ln: string, idx: number) => {
        if (idx === 0) {
          doc.text('-', margin, y)
        }
        doc.text(ln, margin + indent, y)
        line(14)
      })
    }

    let sectionCount = 0
    const startSection = (title: string) => {
      if (sectionCount > 0) divider()
      writeSectionTitle(title)
      sectionCount += 1
    }

    if (data.summary) {
      startSection('Summary')
      writeParagraph(data.summary)
    }

    if (data.experiences.length) {
      startSection('Experience')
      data.experiences.forEach((exp) => {
        const meta = [exp.location, [exp.start, exp.end].filter(Boolean).join(' - ')].filter(Boolean).join(' | ')
        writeItemHeader(`${exp.role} - ${exp.company}`.trim(), meta)
        if (exp.summary) {
          writeParagraph(exp.summary)
        }
        exp.highlights.filter(Boolean).forEach(writeBullet)
        line(6)
      })
    }

    if (data.projects.length) {
      startSection('Projects')
      data.projects.forEach((proj) => {
        writeItemHeader(proj.name, proj.link)
        if (proj.tech) {
          writeParagraph(proj.tech)
        }
        if (proj.description) {
          writeParagraph(proj.description)
        }
      })
    }

    if (data.education.length) {
      startSection('Education')
      data.education.forEach((edu) => {
        const meta = [edu.start, edu.end].filter(Boolean).join(' - ')
        writeItemHeader(`${edu.degree} - ${edu.school}`.trim(), meta)
        if (edu.details) {
          writeParagraph(edu.details)
        }
      })
    }

    if (data.skills.length) {
      startSection('Skills')
      writeParagraph(data.skills.join(' | '))
    }

    doc.save('resume.pdf')
  }

  const latexEscape = (text: string) =>
    text
      .replace(/([&%$#_{}])/g, '\\$1')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}')

  const exportLatex = () => {
    const bulletJoiner = String.raw` \textbullet{} `
    const headerLine = [data.personal.email, data.personal.phone, data.personal.location]
      .filter(Boolean)
      .join(bulletJoiner)
    const links = [data.personal.website, data.personal.linkedin].filter(Boolean).join(bulletJoiner)

    const blocks: string[] = []
    if (data.summary) {
      blocks.push(`\\section*{Summary}\n${latexEscape(data.summary)}\n`)
    }
    if (data.experiences.length) {
      const expTex = data.experiences
        .map((exp) => {
          const when = [exp.start, exp.end].filter(Boolean).join(' -- ')
          const header = `\\textbf{${latexEscape(exp.role)}} at ${latexEscape(exp.company)} \\hfill {${latexEscape(when)}}\\\n${latexEscape(exp.summary)}`
          const bullets = exp.highlights
            .filter(Boolean)
            .map((h) => `  \\item ${latexEscape(h)}`)
            .join('\n')
          return `${header}\n\\begin{itemize}\n${bullets}\n\\end{itemize}`
        })
        .join('\n')
      blocks.push(`\\section*{Experience}\n${expTex}\n`)
    }
    if (data.projects.length) {
      const projTex = data.projects
        .map((proj) => {
          const link = proj.link ? ` \\hfill {${latexEscape(proj.link)}}` : ''
          return `\\textbf{${latexEscape(proj.name)}}${link}\\\n${latexEscape(proj.tech)}\\\n${latexEscape(proj.description)}`
        })
        .join('\\\n')
      blocks.push(`\\section*{Projects}\n${projTex}\n`)
    }
    if (data.education.length) {
      const eduTex = data.education
        .map((edu) => {
          const when = [edu.start, edu.end].filter(Boolean).join(' -- ')
          return `\\textbf{${latexEscape(edu.school)}} \\hfill {${latexEscape(when)}}\\\n${latexEscape(edu.degree)}\\\n${latexEscape(edu.details)}`
        })
        .join('\\\n')
      blocks.push(`\\section*{Education}\n${eduTex}\n`)
    }
    if (data.skills.length) {
      blocks.push(`\\section*{Skills}\n${latexEscape(data.skills.join(' -- '))}`)
    }

      const tex = `\\documentclass[11pt]{article}\n\\usepackage[margin=0.8in]{geometry}\n\\usepackage{enumitem}\n\\setlist[itemize]{leftmargin=*}\n\\begin{document}\n\\begin{center}\n{\\LARGE ${latexEscape(
        data.personal.fullName || 'Your Name',
      )} \\}\\\n${latexEscape(data.personal.title)} \\\n${headerLine}\\\n${links}\\\n\\end{center}\n${blocks.join('\n')}\\end{document}`

    const blob = new Blob([tex], { type: 'application/x-tex' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'resume.tex'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Resumé builder</p>
          <h1>Resumer</h1>
          <p className="lede">Answer a few prompts and export a polished PDF.</p>
        </div>
        <div className="top-actions">
          <button className="ghost" type="button" onClick={clearData}>
            Start clean
          </button>
          <button className="secondary" type="button" onClick={resetData}>
            Load sample
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="panel form-panel">
          <FormSection title="Personal">
            <div className="grid two">
              <Field label="Full name">
                <input value={data.personal.fullName} onChange={(e) => setPersonal('fullName', e.target.value)} />
              </Field>
              <Field label="Role / title">
                <input value={data.personal.title} onChange={(e) => setPersonal('title', e.target.value)} />
              </Field>
              <Field label="Email">
                <input value={data.personal.email} onChange={(e) => setPersonal('email', e.target.value)} />
              </Field>
              <Field label="Phone">
                <input value={data.personal.phone} onChange={(e) => setPersonal('phone', e.target.value)} />
              </Field>
              <Field label="Location">
                <input value={data.personal.location} onChange={(e) => setPersonal('location', e.target.value)} />
              </Field>
              <Field label="Website">
                <input value={data.personal.website} onChange={(e) => setPersonal('website', e.target.value)} />
              </Field>
              <Field label="LinkedIn">
                <input value={data.personal.linkedin} onChange={(e) => setPersonal('linkedin', e.target.value)} />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Summary">
            <Field label="Short profile">
              <textarea
                rows={3}
                value={data.summary}
                onChange={(e) => setData((prev) => ({ ...prev, summary: e.target.value }))}
              />
            </Field>
          </FormSection>

          <FormSection title="Experience" actionLabel="Add role" onAction={addExperience}>
            {data.experiences.map((exp, index) => (
              <div className="card" key={`exp-${index}`}>
                <div className="card-header">
                  <p className="muted">Role {index + 1}</p>
                  {data.experiences.length > 1 && (
                    <button className="link" type="button" onClick={() => removeExperience(index)}>
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid two">
                  <Field label="Role">
                    <input value={exp.role} onChange={(e) => setExperienceField(index, 'role', e.target.value)} />
                  </Field>
                  <Field label="Company">
                    <input value={exp.company} onChange={(e) => setExperienceField(index, 'company', e.target.value)} />
                  </Field>
                  <Field label="Location">
                    <input value={exp.location} onChange={(e) => setExperienceField(index, 'location', e.target.value)} />
                  </Field>
                  <div className="grid two compact">
                    <Field label="Start">
                      <input value={exp.start} onChange={(e) => setExperienceField(index, 'start', e.target.value)} />
                    </Field>
                    <Field label="End">
                      <input value={exp.end} onChange={(e) => setExperienceField(index, 'end', e.target.value)} />
                    </Field>
                  </div>
                </div>
                <Field label="One-line summary">
                  <input value={exp.summary} onChange={(e) => setExperienceField(index, 'summary', e.target.value)} />
                </Field>
                <div className="highlights">
                  <div className="highlights-title">
                    <p className="muted">Highlights</p>
                    <button className="link" type="button" onClick={() => addHighlight(index)}>
                      Add highlight
                    </button>
                  </div>
                  {exp.highlights.map((h, hi) => (
                    <div className="highlight-row" key={`h-${hi}`}>
                      <input
                        value={h}
                        onChange={(e) => updateHighlight(index, hi, e.target.value)}
                        placeholder="Impact-driven bullet (result first)"
                      />
                      {exp.highlights.length > 1 && (
                        <button
                          className="icon"
                          type="button"
                          onClick={() => removeHighlight(index, hi)}
                          aria-label="Remove highlight"
                        >
                          x
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </FormSection>

          <FormSection title="Education" actionLabel="Add education" onAction={addEducation}>
            {data.education.map((edu, index) => (
              <div className="card" key={`edu-${index}`}>
                <div className="card-header">
                  <p className="muted">Entry {index + 1}</p>
                  {data.education.length > 1 && (
                    <button className="link" type="button" onClick={() => removeEducation(index)}>
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid two">
                  <Field label="School">
                    <input value={edu.school} onChange={(e) => setEducationField(index, 'school', e.target.value)} />
                  </Field>
                  <Field label="Degree">
                    <input value={edu.degree} onChange={(e) => setEducationField(index, 'degree', e.target.value)} />
                  </Field>
                  <div className="grid two compact">
                    <Field label="Start">
                      <input value={edu.start} onChange={(e) => setEducationField(index, 'start', e.target.value)} />
                    </Field>
                    <Field label="End">
                      <input value={edu.end} onChange={(e) => setEducationField(index, 'end', e.target.value)} />
                    </Field>
                  </div>
                </div>
                <Field label="Details">
                  <input value={edu.details} onChange={(e) => setEducationField(index, 'details', e.target.value)} />
                </Field>
              </div>
            ))}
          </FormSection>

          <FormSection title="Projects" actionLabel="Add project" onAction={addProject}>
            {data.projects.map((proj, index) => (
              <div className="card" key={`proj-${index}`}>
                <div className="card-header">
                  <p className="muted">Project {index + 1}</p>
                  {data.projects.length > 1 && (
                    <button className="link" type="button" onClick={() => removeProject(index)}>
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid two">
                  <Field label="Name">
                    <input value={proj.name} onChange={(e) => setProjectField(index, 'name', e.target.value)} />
                  </Field>
                  <Field label="Link">
                    <input value={proj.link} onChange={(e) => setProjectField(index, 'link', e.target.value)} />
                  </Field>
                  <Field label="Tech">
                    <input value={proj.tech} onChange={(e) => setProjectField(index, 'tech', e.target.value)} />
                  </Field>
                </div>
                <Field label="Description">
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => setProjectField(index, 'description', e.target.value)}
                  />
                </Field>
              </div>
            ))}
          </FormSection>

          <FormSection title="Skills">
            <Field label="Comma-separated skills">
              <input
                value={skillsInput}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder="React, TypeScript, Design systems"
              />
            </Field>
            <div className="chip-row">
              {data.skills.map((skill) => (
                <span className="chip" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </FormSection>
        </section>

        <PreviewPanel data={data} onExportPdf={exportPdf} onExportLatex={exportLatex} />
      </main>
    </div>
  )
}

type SectionProps = {
  title: string
  actionLabel?: string
  onAction?: () => void
  children: ReactNode
}

function FormSection({ title, actionLabel, onAction, children }: SectionProps) {
  return (
    <div className="section">
      <div className="section-head">
        <h2>{title}</h2>
        {actionLabel && onAction && (
          <button className="link" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

type FieldProps = {
  label: string
  children: ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function PreviewPanel({
  data,
  onExportPdf,
  onExportLatex,
}: {
  data: ResumeData
  onExportPdf: () => void
  onExportLatex: () => void
}) {
  const contactLine = [data.personal.email, data.personal.phone, data.personal.location]
    .filter(Boolean)
    .join(' | ')

  return (
    <section className="panel preview">
      <div className="preview-header">
        <div>
          <h2>{data.personal.fullName || 'Your Name'}</h2>
          <p className="muted">{data.personal.title || 'Role / Title'}</p>
          <p className="small">{contactLine}</p>
          <div className="small links">
            {[data.personal.website, data.personal.linkedin]
              .filter(Boolean)
              .map((item) => (
                <span key={item}>{item}</span>
              ))}
          </div>
        </div>
        <div className="export-actions">
          <button className="secondary" type="button" onClick={onExportPdf}>
            Download PDF
          </button>
          <button className="ghost" type="button" onClick={onExportLatex}>
            Download TeX
          </button>
        </div>
      </div>

      {data.summary && (
        <div className="preview-block">
          <h3>Summary</h3>
          <p>{data.summary}</p>
        </div>
      )}

      {data.experiences.length > 0 && (
        <div className="preview-block">
          <h3>Experience</h3>
          {data.experiences.map((exp, index) => (
            <div className="preview-item" key={`px-${index}`}>
              <div className="title-row">
                <div>
                  <p className="item-title">{exp.role || 'Role'}</p>
                  <p className="muted">{exp.company}</p>
                </div>
                <p className="small muted">
                  {[exp.start, exp.end].filter(Boolean).join(' - ')}
                </p>
              </div>
              <p className="small muted">{[exp.location, exp.summary].filter(Boolean).join(' | ')}</p>
              <ul>
                {exp.highlights.filter(Boolean).map((h, hi) => (
                  <li key={`ph-${hi}`}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div className="preview-block">
          <h3>Projects</h3>
          {data.projects.map((proj, index) => (
            <div className="preview-item" key={`pp-${index}`}>
              <div className="title-row">
                <p className="item-title">{proj.name}</p>
                <p className="small muted">{proj.tech}</p>
              </div>
              <p className="small muted">{proj.link}</p>
              <p>{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="preview-block">
          <h3>Education</h3>
          {data.education.map((edu, index) => (
            <div className="preview-item" key={`pe-${index}`}>
              <div className="title-row">
                <p className="item-title">{edu.school}</p>
                <p className="small muted">{[edu.start, edu.end].filter(Boolean).join(' - ')}</p>
              </div>
              <p className="small muted">{edu.degree}</p>
              <p>{edu.details}</p>
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="preview-block">
          <h3>Skills</h3>
          <div className="chip-row">
            {data.skills.map((skill) => (
              <span className="chip" key={`ps-${skill}`}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default App
